import { Users } from 'lucide-react';
import Prose from '@/shared/components/common/prose';

export default function Team({ team }) {
    const members = team?.members ?? [];

    return (
        <section aria-labelledby="team-heading">
            <div className="flex items-center gap-2 text-[#104838] font-bold text-lg sm:text-xl mb-6 sm:mb-8">
                <Users className="size-5 shrink-0" aria-hidden="true" />
                <h2 id="team-heading">{team?.title || 'Meet The Team'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {members.map((member, index) => (
                    <div
                        key={member.id}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className="animate-fade-in-up bg-white rounded-3xl border border-border/70 overflow-hidden shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#104838]/5 group"
                    >
                        <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                            <img
                                src={member.photo || '/images/home/consulting-room.svg'}
                                alt={member.name}
                                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                                <h3 className="text-[#104838] text-xl font-bold tracking-tight">
                                    {member.name}
                                </h3>
                                <p className="text-xs font-bold tracking-wider text-primary uppercase mt-1">
                                    {member.title}
                                </p>
                            </div>

                            <Prose
                                html={member.bio}
                                className="text-muted-foreground text-sm leading-relaxed"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
