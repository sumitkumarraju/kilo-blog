package com.kilo.blog;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kilo.blog.domain.PostStatus;
import com.kilo.blog.repository.PostRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ApiIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    PostRepository postRepository;

    @Test
    void healthIsPublic() throws Exception {
        mvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
        mvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void listPublishedMatchesFrontendPageContract() throws Exception {
        mvc.perform(get("/api/posts").param("size", "4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.number").value(0))
                .andExpect(jsonPath("$.size").value(4))
                .andExpect(jsonPath("$.first").value(true))
                .andExpect(jsonPath("$.last").isBoolean())
                .andExpect(jsonPath("$.totalElements").isNumber())
                .andExpect(jsonPath("$.totalPages").isNumber())
                .andExpect(jsonPath("$.content[0].createdAt").exists())
                .andExpect(jsonPath("$.content[0].author.email").exists())
                .andExpect(jsonPath("$.content[0].status").value("PUBLISHED"));
    }

    @Test
    void featuredAndTagsArePublic() throws Exception {
        mvc.perform(get("/api/posts/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].slug").exists());
        mvc.perform(get("/api/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").exists())
                .andExpect(jsonPath("$[0].postCount").isNumber());
    }

    @Test
    void unauthenticatedProtectedRouteReturns401Json() throws Exception {
        mvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"));
        mvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"x","content":"<p>hi</p>","tagSlugs":[]}
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginAndCreateDraft() throws Exception {
        String token = login("sara@kilo.blog", "Author123!");

        MvcResult created = mvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"A new draft from tests","content":"<p>Hello backend</p>","excerpt":"n","tagSlugs":["design"]}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andExpect(jsonPath("$.slug").value("a-new-draft-from-tests"))
                .andExpect(jsonPath("$.author.email").value("sara@kilo.blog"))
                .andReturn();

        String slug = objectMapper.readTree(created.getResponse().getContentAsString()).get("slug").asText();

        mvc.perform(put("/api/posts/" + slug)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"A new draft from tests","slug":"renamed-draft-from-tests","content":"<p>Updated</p>"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("renamed-draft-from-tests"));
    }

    @Test
    void loginIsCaseInsensitiveAndRegisterRejectsDuplicateEmail() throws Exception {
        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"Admin@Kilo.Blog","password":"Admin123!"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.role").value("ADMIN"));

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"ADMIN@kilo.blog","password":"Another123!","displayName":"Dup"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void commentsRejectedOnUnpublishedPosts() throws Exception {
        String token = login("sara@kilo.blog", "Author123!");
        MvcResult created = mvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Not public yet","content":"<p>draft</p>","tagSlugs":[]}
                                """))
                .andExpect(status().isOk())
                .andReturn();
        String slug = objectMapper.readTree(created.getResponse().getContentAsString()).get("slug").asText();

        mvc.perform(post("/api/posts/" + slug + "/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":"hello","guestName":"Pat"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void publishedPostCanBeReadAndAcceptsGuestComment() throws Exception {
        String slug = postRepository.findAll().stream()
                .filter(p -> p.getStatus() == PostStatus.PUBLISHED)
                .findFirst()
                .orElseThrow()
                .getSlug();

        mvc.perform(get("/api/posts/" + slug))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isString())
                .andExpect(jsonPath("$.author.displayName").exists());

        mvc.perform(post("/api/posts/" + slug + "/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":"Loved this.","guestName":"Jordan"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.guestName").value("Jordan"));
    }

    @Test
    void editorCanApprovePendingPost() throws Exception {
        String authorToken = login("sara@kilo.blog", "Author123!");
        MvcResult created = mvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + authorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Ready for review","content":"<p>body</p>","tagSlugs":[]}
                                """))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode post = objectMapper.readTree(created.getResponse().getContentAsString());
        String id = post.get("id").asText();

        mvc.perform(post("/api/posts/" + id + "/submit")
                        .header("Authorization", "Bearer " + authorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING_REVIEW"));

        String editorToken = login("editor@kilo.blog", "Editor123!");
        mvc.perform(post("/api/posts/" + id + "/approve")
                        .header("Authorization", "Bearer " + editorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PUBLISHED"));
    }

    @Test
    void searchAndTagFilterReturnPublishedPosts() throws Exception {
        mvc.perform(get("/api/posts").param("q", "empty states"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").exists());
        mvc.perform(get("/api/posts").param("tag", "design"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").isNumber());
    }

    private String login(String email, String password) throws Exception {
        MvcResult result = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(body.get("token").asText()).isNotBlank();
        return body.get("token").asText();
    }
}
