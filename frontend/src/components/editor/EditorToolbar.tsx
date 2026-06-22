import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from 'lucide-react';
import clsx from 'clsx';

interface Props {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  function setLink() {
    const previous = editor!.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  function setImage() {
    const url = window.prompt('Image URL');
    if (!url) return;
    editor!.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="sticky top-[68px] z-30 -mx-2 flex flex-wrap items-center gap-1 rounded-xl border border-line bg-paper/95 p-1.5 backdrop-blur-sm">
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        label="Heading 2"
      >
        <Heading2 className="size-4" strokeWidth={1.75} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        label="Heading 3"
      >
        <Heading3 className="size-4" strokeWidth={1.75} />
      </Btn>
      <Divider />
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        label="Bold"
      >
        <Bold className="size-4" strokeWidth={1.75} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        label="Italic"
      >
        <Italic className="size-4" strokeWidth={1.75} />
      </Btn>
      <Btn onClick={setLink} active={editor.isActive('link')} label="Link">
        <LinkIcon className="size-4" strokeWidth={1.75} />
      </Btn>
      <Divider />
      <Btn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        label="Bullet list"
      >
        <List className="size-4" strokeWidth={1.75} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        label="Ordered list"
      >
        <ListOrdered className="size-4" strokeWidth={1.75} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        label="Quote"
      >
        <Quote className="size-4" strokeWidth={1.75} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        label="Code block"
      >
        <Code className="size-4" strokeWidth={1.75} />
      </Btn>
      <Divider />
      <Btn onClick={setImage} label="Insert image">
        <ImageIcon className="size-4" strokeWidth={1.75} />
      </Btn>
      <div className="ml-auto flex items-center gap-1">
        <Btn
          onClick={() => editor.chain().focus().undo().run()}
          label="Undo"
          disabled={!editor.can().undo()}
        >
          <Undo2 className="size-4" strokeWidth={1.75} />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().redo().run()}
          label="Redo"
          disabled={!editor.can().redo()}
        >
          <Redo2 className="size-4" strokeWidth={1.75} />
        </Btn>
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  active,
  label,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={clsx(
        'inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-ink transition-colors duration-160',
        active
          ? 'bg-ink text-paper'
          : 'hover:bg-surface-2',
        disabled && 'opacity-40 pointer-events-none',
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-line" />;
}
