import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import LinkExt from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';
import { useEffect } from 'react';
import clsx from 'clsx';
import { Bold, Italic, Link as LinkIcon } from 'lucide-react';
import { EditorToolbar } from './EditorToolbar';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = 'Begin with a sentence that demands attention…',
  className,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      ImageExt.configure({
        HTMLAttributes: { class: 'rounded-xl border border-line' },
      }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose font-serif',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div className={clsx('space-y-4', className)}>
      <EditorToolbar editor={editor} />
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 160 }}
          className="flex items-center gap-1 rounded-full border border-line bg-paper p-1 shadow-sm"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
            className={clsx(
              'inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-160',
              editor.isActive('bold')
                ? 'bg-ink text-paper'
                : 'hover:bg-surface-2',
            )}
          >
            <Bold className="size-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
            className={clsx(
              'inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-160',
              editor.isActive('italic')
                ? 'bg-ink text-paper'
                : 'hover:bg-surface-2',
            )}
          >
            <Italic className="size-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => {
              const previous = editor.getAttributes('link').href as
                | string
                | undefined;
              const url = window.prompt('URL', previous ?? 'https://');
              if (url === null) return;
              if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
            }}
            aria-label="Link"
            className={clsx(
              'inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-160',
              editor.isActive('link')
                ? 'bg-ink text-paper'
                : 'hover:bg-surface-2',
            )}
          >
            <LinkIcon className="size-3.5" strokeWidth={1.75} />
          </button>
        </BubbleMenu>
      )}
      <div className="rounded-xl border border-line bg-paper p-6 sm:p-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
