import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading2,
    Heading3,
    Italic,
    Link2,
    Link2Off,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo2,
    RemoveFormatting,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo2,
} from 'lucide-react';
import { useCallback } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * The editor used for every rich text field in the admin.
 *
 * It writes HTML straight into a hidden input so it submits with a normal
 * Inertia <Form>, the same way the plain inputs do. Whatever it produces is
 * re-sanitised server-side before it is stored.
 */
export default function RichTextEditor({
    name,
    defaultValue = '',
    placeholder = 'Write something…',
    onChange,
}) {
    const editor = useEditor({
        extensions: [
            // StarterKit already bundles bold, italic, underline, strike,
            // code, headings, lists, blockquote, hr, link and history.
            StarterKit.configure({
                heading: { levels: [2, 3] },
                link: { openOnClick: false },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder }),
        ],
        content: defaultValue || '',
        editorProps: {
            attributes: {
                class: 'admin-prose min-h-40 px-4 py-3 focus:outline-none',
            },
        },
        onUpdate: ({ editor: instance }) => onChange?.(instance.getHTML()),
    });

    const setLink = useCallback(() => {
        if (!editor) {
            return;
        }

        const previous = editor.getAttributes('link').href ?? '';
        const url = window.prompt('Link URL', previous);

        if (url === null) {
            return;
        }

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
    }, [editor]);

    if (!editor) {
        return null;
    }

    const groups = [
        [
            {
                icon: Bold,
                label: 'Bold',
                mark: 'bold',
                run: (c) => c.toggleBold(),
            },
            {
                icon: Italic,
                label: 'Italic',
                mark: 'italic',
                run: (c) => c.toggleItalic(),
            },
            {
                icon: UnderlineIcon,
                label: 'Underline',
                mark: 'underline',
                run: (c) => c.toggleUnderline(),
            },
            {
                icon: Strikethrough,
                label: 'Strikethrough',
                mark: 'strike',
                run: (c) => c.toggleStrike(),
            },
            {
                icon: Code,
                label: 'Inline code',
                mark: 'code',
                run: (c) => c.toggleCode(),
            },
        ],
        [
            {
                icon: Heading2,
                label: 'Heading 2',
                mark: { name: 'heading', attrs: { level: 2 } },
                run: (c) => c.toggleHeading({ level: 2 }),
            },
            {
                icon: Heading3,
                label: 'Heading 3',
                mark: { name: 'heading', attrs: { level: 3 } },
                run: (c) => c.toggleHeading({ level: 3 }),
            },
            {
                icon: List,
                label: 'Bullet list',
                mark: 'bulletList',
                run: (c) => c.toggleBulletList(),
            },
            {
                icon: ListOrdered,
                label: 'Numbered list',
                mark: 'orderedList',
                run: (c) => c.toggleOrderedList(),
            },
            {
                icon: Quote,
                label: 'Quote',
                mark: 'blockquote',
                run: (c) => c.toggleBlockquote(),
            },
        ],
        [
            {
                icon: AlignLeft,
                label: 'Align left',
                mark: { name: 'left' },
                align: 'left',
                run: (c) => c.setTextAlign('left'),
            },
            {
                icon: AlignCenter,
                label: 'Align centre',
                mark: { name: 'center' },
                align: 'center',
                run: (c) => c.setTextAlign('center'),
            },
            {
                icon: AlignRight,
                label: 'Align right',
                mark: { name: 'right' },
                align: 'right',
                run: (c) => c.setTextAlign('right'),
            },
        ],
        [
            {
                icon: Minus,
                label: 'Divider',
                run: (c) => c.setHorizontalRule(),
            },
            {
                icon: RemoveFormatting,
                label: 'Clear formatting',
                run: (c) => c.unsetAllMarks().clearNodes(),
            },
        ],
        [
            { icon: Undo2, label: 'Undo', run: (c) => c.undo() },
            { icon: Redo2, label: 'Redo', run: (c) => c.redo() },
        ],
    ];

    const isActive = (button) => {
        if (button.align) {
            return editor.isActive({ textAlign: button.align });
        }

        if (typeof button.mark === 'string') {
            return editor.isActive(button.mark);
        }

        if (button.mark?.attrs) {
            return editor.isActive(button.mark.name, button.mark.attrs);
        }

        return false;
    };

    return (
        <div className="border-input focus-within:border-ring focus-within:ring-ring/50 overflow-hidden rounded-md border transition-[color,box-shadow] focus-within:ring-[3px]">
            <div className="bg-muted/40 border-input flex flex-wrap items-center gap-0.5 border-b p-1.5">
                {groups.map((group, index) => (
                    <div key={index} className="flex items-center gap-0.5">
                        {index > 0 ? (
                            <span
                                aria-hidden="true"
                                className="bg-border mx-1 h-5 w-px"
                            />
                        ) : null}

                        {group.map((button) => (
                            <ToolbarButton
                                key={button.label}
                                icon={button.icon}
                                label={button.label}
                                active={isActive(button)}
                                onClick={() =>
                                    button.run(editor.chain().focus()).run()
                                }
                            />
                        ))}
                    </div>
                ))}

                <span aria-hidden="true" className="bg-border mx-1 h-5 w-px" />

                <ToolbarButton
                    icon={Link2}
                    label="Add link"
                    active={editor.isActive('link')}
                    onClick={setLink}
                />
                <ToolbarButton
                    icon={Link2Off}
                    label="Remove link"
                    disabled={!editor.isActive('link')}
                    onClick={() => editor.chain().focus().unsetLink().run()}
                />
            </div>

            <EditorContent editor={editor} />

            {/* Submits with the surrounding <Form> like any other field. */}
            <input type="hidden" name={name} value={editor.getHTML()} />
        </div>
    );
}

function ToolbarButton({ icon: Icon, label, active, disabled, onClick }) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                'inline-flex size-8 items-center justify-center rounded transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'disabled:pointer-events-none disabled:opacity-40',
                active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground',
            )}
        >
            <Icon className="size-4" aria-hidden="true" />
        </button>
    );
}
