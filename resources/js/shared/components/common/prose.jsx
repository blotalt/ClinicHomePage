import { cn } from '@/shared/lib/utils';

/**
 * Renders rich text authored in the admin.
 *
 * The HTML is sanitised server-side by App\Support\HtmlSanitizer before it is
 * stored, which is what makes dangerouslySetInnerHTML acceptable here. Never
 * point this at anything a visitor can write.
 */
export default function Prose({ html, className, as: Tag = 'div' }) {
    if (!html) {
        return null;
    }

    return (
        <Tag
            className={cn('site-prose', className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
