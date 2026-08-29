<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;
use DOMText;

/**
 * Allow-list sanitizer for the rich text the admin writes.
 *
 * The output is rendered with `dangerouslySetInnerHTML` on the public site,
 * so anything not explicitly permitted here is removed. Disallowed elements
 * are unwrapped (their text is kept) rather than dropped, so a paste from
 * Word loses its markup but not its words.
 */
class HtmlSanitizer
{
    /** @var list<string> */
    private const ALLOWED_TAGS = [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li',
        'h2', 'h3', 'h4', 'blockquote', 'a', 'code', 'hr',
    ];

    /** Tags whose content carries no meaning and should go entirely. */
    private const STRIP_WITH_CONTENT = [
        'script', 'style', 'iframe', 'object', 'embed', 'form', 'svg',
    ];

    /** @var list<string> */
    private const ALLOWED_LINK_SCHEMES = ['http', 'https', 'mailto', 'tel'];

    public static function clean(?string $html): string
    {
        $html = trim((string) $html);

        if ($html === '') {
            return '';
        }

        $document = new DOMDocument;

        $previous = libxml_use_internal_errors(true);
        $document->loadHTML(
            '<?xml encoding="UTF-8"><div id="sanitizer-root">'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $document->getElementById('sanitizer-root');

        if (! $root instanceof DOMElement) {
            return '';
        }

        self::cleanChildren($root);

        $result = '';

        foreach ($root->childNodes as $child) {
            $result .= $document->saveHTML($child);
        }

        return trim($result);
    }

    private static function cleanChildren(DOMNode $parent): void
    {
        // Snapshot first: the loop rewrites $parent's child list.
        $children = iterator_to_array($parent->childNodes);

        foreach ($children as $child) {
            if ($child instanceof DOMText) {
                continue;
            }

            if (! $child instanceof DOMElement) {
                $parent->removeChild($child); // comments, PIs, CDATA

                continue;
            }

            $tag = strtolower($child->nodeName);

            if (in_array($tag, self::STRIP_WITH_CONTENT, true)) {
                $parent->removeChild($child);

                continue;
            }

            self::cleanChildren($child);

            if (in_array($tag, self::ALLOWED_TAGS, true)) {
                self::cleanAttributes($child, $tag);

                continue;
            }

            self::unwrap($child, $parent);
        }
    }

    /**
     * Replace an element with its children, keeping the text.
     */
    private static function unwrap(DOMElement $element, DOMNode $parent): void
    {
        while ($element->firstChild !== null) {
            $parent->insertBefore($element->firstChild, $element);
        }

        $parent->removeChild($element);
    }

    private static function cleanAttributes(DOMElement $element, string $tag): void
    {
        // Read href before the strip, since the strip removes it too.
        $href = $tag === 'a' ? self::safeHref($element->getAttribute('href')) : null;

        foreach (iterator_to_array($element->attributes ?? []) as $attribute) {
            $element->removeAttribute($attribute->nodeName);
        }

        if ($tag !== 'a') {
            return;
        }

        if ($href === null) {
            // A link with no usable destination is just text.
            self::unwrap($element, $element->parentNode);

            return;
        }

        $element->setAttribute('href', $href);
        $element->setAttribute('rel', 'noopener noreferrer nofollow');
    }

    private static function safeHref(string $href): ?string
    {
        $href = trim($href);

        if ($href === '') {
            return null;
        }

        if (str_starts_with($href, '/') || str_starts_with($href, '#')) {
            return $href;
        }

        $scheme = strtolower((string) parse_url($href, PHP_URL_SCHEME));

        return in_array($scheme, self::ALLOWED_LINK_SCHEMES, true) ? $href : null;
    }
}
