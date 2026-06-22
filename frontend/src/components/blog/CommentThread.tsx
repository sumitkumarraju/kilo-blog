import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CornerDownRight } from 'lucide-react';
import { fmtRelative, initials } from '@/lib/format';
import type { Comment, CreateCommentInput } from '@/types/api';
import { CommentForm } from './CommentForm';

interface Props {
  comments: Comment[];
  onReply: (input: CreateCommentInput) => Promise<unknown>;
}

interface Tree extends Comment {
  children: Tree[];
}

function buildTree(comments: Comment[]): Tree[] {
  const byId = new Map<string, Tree>();
  const roots: Tree[] = [];
  comments.forEach((c) => byId.set(String(c.id), { ...c, children: [] }));
  byId.forEach((c) => {
    if (c.parentId != null && byId.has(String(c.parentId))) {
      byId.get(String(c.parentId))!.children.push(c);
    } else {
      roots.push(c);
    }
  });
  return roots;
}

export function CommentThread({ comments, onReply }: Props) {
  const tree = useMemo(() => buildTree(comments), [comments]);

  if (!tree.length) {
    return (
      <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
        No comments yet — be the first to share a thought.
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      <AnimatePresence mode="popLayout">
        {tree.map((c) => (
          <Node key={String(c.id)} node={c} onReply={onReply} depth={0} />
        ))}
      </AnimatePresence>
    </ul>
  );
}

function Node({
  node,
  onReply,
  depth,
}: {
  node: Tree;
  onReply: (input: CreateCommentInput) => Promise<unknown>;
  depth: number;
}) {
  const [replying, setReplying] = useState(false);
  const author = node.author;
  const name = author?.displayName ?? author?.email ?? node.guestName ?? 'Anonymous';

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className={depth > 0 ? 'ml-6 border-l border-line pl-6' : ''}
    >
      <div className="flex items-start gap-3">
        {author?.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={name}
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-surface-2 font-mono text-[11px] uppercase text-ink">
            {initials(name)}
          </span>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-ink">{name}</span>
            <span className="text-muted">·</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
              {fmtRelative(node.createdAt)}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
            {node.content}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
            <button
              type="button"
              onClick={() => setReplying((r) => !r)}
              className="cursor-pointer transition-colors duration-160 hover:text-ink"
            >
              {replying ? 'Cancel' : 'Reply'}
            </button>
          </div>
          {replying && (
            <div className="mt-3">
              <CommentForm
                onSubmit={async (input) => {
                  await onReply({ ...input, parentId: node.id });
                  setReplying(false);
                }}
                parentId={node.id}
                placeholder={`Replying to ${name}`}
                compact
                onDone={() => setReplying(false)}
              />
            </div>
          )}
        </div>
      </div>
      {node.children.length > 0 && (
        <ul className="mt-6 space-y-6">
          {node.children.map((child) => (
            <div key={String(child.id)} className="relative">
              <CornerDownRight
                className="absolute -left-5 top-1 size-3 text-muted/50"
                strokeWidth={1.5}
              />
              <Node node={child} onReply={onReply} depth={depth + 1} />
            </div>
          ))}
        </ul>
      )}
    </motion.li>
  );
}
