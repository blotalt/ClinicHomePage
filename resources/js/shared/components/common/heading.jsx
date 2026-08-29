export default function Heading({ title, description, variant = 'default' }) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-1.5'}>
            <h2
                className={
                    variant === 'small'
                        ? 'mb-1 text-lg font-semibold'
                        : 'text-2xl sm:text-3xl font-bold tracking-tight text-ink'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
            )}
        </header>
    );
}
