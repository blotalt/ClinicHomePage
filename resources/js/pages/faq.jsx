import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Search,
    ChevronDown,
    Calendar,
    Sparkles,
    CreditCard,
    Building2,
    ShieldCheck,
    Leaf,
    Clock,
    Sprout,
    Receipt,
    Video,
    MessageSquareQuote,
    Phone,
} from 'lucide-react';
import Prose from '@/shared/components/common/prose';
import { resolveIcon } from '@/shared/lib/icons';
import { cn } from '@/shared/lib/utils';
import { contact } from '@/routes';

export default function FAQ({ page, contactCard, categories = [], faqs = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openItems, setOpenItems] = useState({});
    const [hoveredId, setHoveredId] = useState(null);

    const toggleItem = (id) => {
        setOpenItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Filter FAQs by search query and category
    const filteredFaqs = useMemo(() => {
        let result = faqs;

        if (activeCategory !== 'all') {
            result = result.filter((faq) => faq.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(query) ||
                    faq.answer.toLowerCase().includes(query),
            );
        }

        return result;
    }, [faqs, activeCategory, searchQuery]);

    // Group filtered FAQs by category
    const groupedFaqs = useMemo(() => {
        const groups = {};
        for (const faq of filteredFaqs) {
            const cat = faq.category || 'general';
            if (!groups[cat]) {
                groups[cat] = {
                    id: cat,
                    label: faq.categoryLabel || cat.charAt(0).toUpperCase() + cat.slice(1),
                    icon: faq.icon || 'Calendar',
                    items: [],
                };
            }
            groups[cat].items.push(faq);
        }
        return Object.values(groups);
    }, [filteredFaqs]);

    const getCategoryIcon = (id) => {
        switch (id) {
            case 'appointments':
                return Calendar;
            case 'services':
                return Sparkles;
            case 'billing':
                return CreditCard;
            case 'policies':
                return ShieldCheck;
            default:
                return Sparkles;
        }
    };

    return (
        <>
            <Head title="Frequently Asked Questions" />

            <div className="min-h-screen bg-[#fcfbf9]/60 pb-20">
                {/* Hero Section */}
                <div className="bg-[#eaf4f4] border-b border-sky-100/60 py-16 sm:py-20 lg:py-24">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <h1 className="text-[#104838] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
                            {page?.title || 'How can we support your wellness journey?'}
                        </h1>
                        <p className="text-muted-foreground mt-4 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-balance">
                            {page?.subtitle ||
                                "Find answers to common questions about our services, booking process, and clinic policies. We're here to make your experience as seamless as possible."}
                        </p>

                        {/* Search Input */}
                        <div className="relative mx-auto mt-8 sm:mt-10 max-w-xl">
                            <Search
                                className="text-[#104838]/60 absolute top-1/2 left-4 size-5 -translate-y-1/2"
                                aria-hidden="true"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={page?.searchPlaceholder || 'Search for answers...'}
                                className="bg-white text-ink placeholder:text-muted-foreground/70 focus:ring-[#104838]/30 focus:border-[#104838] w-full rounded-full border border-border/80 py-3.5 pr-6 pl-12 text-sm shadow-xs transition-all outline-hidden focus:ring-4"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="text-muted-foreground hover:text-ink absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded-md hover:bg-muted"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category Selector Grid */}
                <div className="mx-auto max-w-6xl px-6 lg:px-8 -mt-8 sm:-mt-10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                        {categories.map((category, idx) => {
                            const IconComponent = getCategoryIcon(category.id);
                            const isActive = activeCategory === category.id;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    style={{ animationDelay: `${idx * 60}ms` }}
                                    onClick={() =>
                                        setActiveCategory(
                                            activeCategory === category.id
                                                ? 'all'
                                                : category.id,
                                        )
                                    }
                                    className={cn(
                                        'animate-fade-in-up bg-white border rounded-3xl p-5 sm:p-6 text-center flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-xs hover:-translate-y-1.5 hover:shadow-lg',
                                        isActive
                                            ? 'border-[#104838] ring-2 ring-[#104838]/20 bg-[#f4f9f7]'
                                            : 'border-border/70 hover:border-[#104838]/40',
                                    )}
                                >
                                    <div className="size-12 rounded-2xl bg-[#bde8e2] text-[#104838] flex items-center justify-center mb-3 shrink-0">
                                        <IconComponent className="size-5.5" aria-hidden="true" />
                                    </div>
                                    <span className="text-[#104838] text-sm font-bold">
                                        {category.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content: FAQs and Contact Card */}
                <div className="mx-auto max-w-6xl px-6 lg:px-8 mt-12 sm:mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        {/* FAQs Accordion Column */}
                        <div className="lg:col-span-8 space-y-10">
                            {groupedFaqs.length === 0 ? (
                                <div className="bg-white border border-border/70 rounded-2xl p-12 text-center shadow-xs">
                                    <MessageSquareQuote className="size-10 text-muted-foreground/50 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-ink">No questions found</h3>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        We couldn't find any questions matching "{searchQuery}".
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setActiveCategory('all');
                                        }}
                                        className="text-[#104838] font-bold text-sm mt-4 hover:underline"
                                    >
                                        View all questions
                                    </button>
                                </div>
                            ) : (
                                groupedFaqs.map((group) => {
                                    const GroupIcon = getCategoryIcon(group.id);

                                    return (
                                        <div key={group.id} className="space-y-4">
                                            {/* Category Section Title */}
                                            <div className="flex items-center gap-2.5 text-[#104838] font-bold text-lg sm:text-xl">
                                                <GroupIcon className="size-5 shrink-0" aria-hidden="true" />
                                                <h2>{group.label}</h2>
                                            </div>

                                            {/* Accordion List */}
                                            <div className="space-y-3">
                                                {group.items.map((faq, faqIdx) => {
                                                    const isExpanded = Boolean(openItems[faq.id] || hoveredId === faq.id);

                                                    return (
                                                        <div
                                                            key={faq.id}
                                                            style={{ animationDelay: `${faqIdx * 70}ms` }}
                                                            onMouseEnter={() => setHoveredId(faq.id)}
                                                            onMouseLeave={() => setHoveredId(null)}
                                                            className={cn(
                                                                'animate-fade-in-up bg-white border rounded-2xl shadow-xs overflow-hidden transition-all duration-300',
                                                                isExpanded
                                                                    ? 'border-[#104838]/60 shadow-md ring-1 ring-[#104838]/10 bg-[#fafcfb]'
                                                                    : 'border-border/70 hover:border-[#104838]/40 hover:shadow-sm',
                                                            )}
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleItem(faq.id)}
                                                                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer transition-colors"
                                                                aria-expanded={isExpanded}
                                                            >
                                                                <span
                                                                    className={cn(
                                                                        'font-semibold text-base sm:text-lg transition-colors',
                                                                        isExpanded
                                                                            ? 'text-[#104838]'
                                                                            : 'text-[#104838]/90',
                                                                    )}
                                                                >
                                                                    {faq.question}
                                                                </span>
                                                                <ChevronDown
                                                                    className={cn(
                                                                        'size-5 text-muted-foreground shrink-0 transition-transform duration-300',
                                                                        isExpanded && 'rotate-180 text-[#104838]',
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            </button>

                                                            {isExpanded && (
                                                                <div className="px-6 pb-6 pt-1 border-t border-border/40 text-muted-foreground text-sm sm:text-base leading-relaxed animate-in fade-in-50 slide-in-from-top-1 duration-200">
                                                                    <Prose html={faq.answer} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Right Column: "Still have questions?" Card */}
                        <div className="lg:col-span-4 lg:sticky lg:top-28">
                            <div className="animate-fade-in-up bg-white border border-border/70 rounded-3xl overflow-hidden shadow-md space-y-0 transition-all duration-300 hover:shadow-xl">
                                <div className="aspect-[4/3] w-full bg-[#efeae1] overflow-hidden">
                                    <img
                                        src={contactCard?.image || '/images/faq/reception.svg'}
                                        alt="Lumina Wellness reception"
                                        className="size-full object-cover"
                                    />
                                </div>
                                <div className="p-6 sm:p-8 space-y-3 text-center">
                                    <h3 className="text-[#104838] text-xl font-bold">
                                        {contactCard?.title || 'Still have questions?'}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {contactCard?.body ||
                                            'Our care team is always here to assist you with anything not covered in our FAQ.'}
                                    </p>
                                    <div className="pt-3">
                                        <Link
                                            href={contact()}
                                            className="bg-[#104838] hover:bg-[#0c382b] text-white w-full inline-flex items-center justify-center rounded-full py-3 px-6 text-sm font-medium shadow-sm transition-colors"
                                        >
                                            {contactCard?.cta || 'Contact Us'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
