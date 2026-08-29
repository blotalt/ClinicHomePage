import { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    Database,
    Table2,
    GitFork,
    KeyRound,
    Copy,
    Check,
    Layers,
    ArrowRight,
    Search,
    Shield,
    Calendar,
    Stethoscope,
    Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';

export default function AdminDatabase({ tables = [], totalRecords = 0, totalTables = 0, driver = 'sqlite' }) {
    const [activeTab, setActiveTab] = useState('diagram');
    const [selectedTable, setSelectedTable] = useState(tables[0]?.name || 'services');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedMermaid, setCopiedMermaid] = useState(false);

    const currentTableData = tables.find((t) => t.name === selectedTable) || tables[0];

    const filteredTables = tables.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const mermaidDiagramCode = `erDiagram
    DEPARTMENTS ||--o{ SERVICES : "offers (1:N)"
    DEPARTMENTS ||--o{ DOCTORS : "employs (1:N)"
    DEPARTMENTS ||--o{ CLINIC_HOURS : "configures (1:N)"
    
    DOCTORS }o--o{ SERVICES : "performs (N:M via doctor_service)"
    DOCTORS ||--o{ APPOINTMENTS : "conducts (1:N)"
    DOCTORS ||--o{ APPOINTMENT_REQUESTS : "assigned_to (1:N)"
    
    USERS ||--o| DOCTORS : "staff_login (1:1)"
    USERS ||--o| PATIENTS : "portal_account (1:1)"
    
    PATIENTS ||--o{ APPOINTMENTS : "books (1:N)"
    PATIENTS ||--o{ APPOINTMENT_REQUESTS : "submits (1:N)"
    PATIENTS ||--o{ TESTIMONIALS : "reviews (1:N)"
    
    SERVICES ||--o{ APPOINTMENTS : "receives (1:N)"
    SERVICES ||--o{ APPOINTMENT_REQUESTS : "requested_for (1:N)"
    SERVICES ||--o{ TESTIMONIALS : "rated_in (1:N)"
    
    APPOINTMENT_REQUESTS ||--o| APPOINTMENTS : "converts_to (1:1)"

    DEPARTMENTS {
        bigint id PK
        string name
        string slug UK
        text description
        string icon
        int position
        boolean is_published
    }

    SERVICES {
        bigint id PK
        bigint department_id FK
        string title
        string slug UK
        longtext body
        string icon
        string image_path
        smallint duration_minutes
        decimal price
        json meta
        boolean is_published
    }

    DOCTORS {
        bigint id PK
        bigint department_id FK
        bigint user_id FK
        string name
        string slug UK
        string title
        longtext bio
        string photo_path
        string email
        boolean is_published
    }

    DOCTOR_SERVICE {
        bigint id PK
        bigint doctor_id FK
        bigint service_id FK
    }

    PATIENTS {
        bigint id PK
        bigint user_id FK
        string first_name
        string last_name
        string email
        string phone
        date date_of_birth
        text notes
    }

    APPOINTMENTS {
        bigint id PK
        bigint patient_id FK
        bigint doctor_id FK
        bigint service_id FK
        bigint appointment_request_id FK
        datetime scheduled_at
        smallint duration_minutes
        string status
        text notes
    }

    APPOINTMENT_REQUESTS {
        bigint id PK
        string first_name
        string last_name
        string email
        string phone
        bigint service_id FK
        bigint doctor_id FK
        bigint patient_id FK
        string service
        text message
        timestamp read_at
    }

    CLINIC_HOURS {
        bigint id PK
        bigint department_id FK
        tinyint day_of_week
        time opens_at
        time closes_at
        boolean is_closed
    }

    TESTIMONIALS {
        bigint id PK
        bigint patient_id FK
        bigint service_id FK
        string author_name
        tinyint rating
        longtext body
        boolean is_published
    }

    CONTENT_ITEMS {
        bigint id PK
        string collection
        string title
        longtext body
        string icon
        string image_path
        json meta
        int position
        boolean is_published
    }

    SITE_SETTINGS {
        bigint id PK
        string key UK
        string group
        longtext value
        string type
    }

    USERS {
        bigint id PK
        string name
        string email UK
        string password
        boolean is_admin
    }`;

    const handleCopyMermaid = () => {
        navigator.clipboard.writeText(mermaidDiagramCode);
        setCopiedMermaid(true);
        setTimeout(() => setCopiedMermaid(false), 2000);
    };

    return (
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <Head title="Database & ERD Architecture" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                        Database Architecture & ERD
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Live schema explorer, entity relationships, constraints, and data dictionary for Lumina Wellness.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyMermaid}
                        className="gap-2 text-xs"
                    >
                        {copiedMermaid ? (
                            <>
                                <Check className="size-4 text-green-600" />
                                Copied Mermaid
                            </>
                        ) : (
                            <>
                                <Copy className="size-4" />
                                Copy Mermaid ERD
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-card border border-border/70 rounded-xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                        <Table2 className="size-4 text-primary" />
                        Total Tables
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-ink">{totalTables}</div>
                </div>

                <div className="bg-card border border-border/70 rounded-xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                        <Database className="size-4 text-primary" />
                        Total Records
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-ink">{totalRecords}</div>
                </div>

                <div className="bg-card border border-border/70 rounded-xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                        <GitFork className="size-4 text-primary" />
                        Relationships
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-ink">14 Foreign Keys</div>
                </div>

                <div className="bg-card border border-border/70 rounded-xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                        <Shield className="size-4 text-primary" />
                        Engine / Driver
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-ink uppercase">{driver}</div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-border">
                <button
                    type="button"
                    onClick={() => setActiveTab('diagram')}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer',
                        activeTab === 'diagram'
                            ? 'border-primary text-primary font-semibold'
                            : 'border-transparent text-muted-foreground hover:text-ink',
                    )}
                >
                    <Layers className="size-4" />
                    Entity Relationship Model (ERD)
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('dictionary')}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer',
                        activeTab === 'dictionary'
                            ? 'border-primary text-primary font-semibold'
                            : 'border-transparent text-muted-foreground hover:text-ink',
                    )}
                >
                    <Table2 className="size-4" />
                    Data Dictionary & Schema Explorer
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('mermaid')}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer',
                        activeTab === 'mermaid'
                            ? 'border-primary text-primary font-semibold'
                            : 'border-transparent text-muted-foreground hover:text-ink',
                    )}
                >
                    <GitFork className="size-4" />
                    Mermaid Schema Code
                </button>
            </div>

            {/* Tab 1: Visual Entity Relationship Model (ERD) */}
            {activeTab === 'diagram' && (
                <div className="space-y-8">
                    {/* Domain Architecture Map */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Domain 1: Clinical Domain */}
                        <div className="bg-card border-2 border-emerald-500/30 rounded-2xl p-6 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
                                <Stethoscope className="size-5" />
                                <h3>Clinical Domain</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Core medical divisions, treatments, practitioner profiles, and many-to-many services mapping.
                            </p>
                            <div className="space-y-2 pt-2">
                                <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-emerald-900">departments</div>
                                    <div className="text-muted-foreground text-[11px]">Primary Care, Nutrition, Therapy</div>
                                </div>
                                <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-emerald-900">services (FK: department_id)</div>
                                    <div className="text-muted-foreground text-[11px]">Title, duration, price, rich body</div>
                                </div>
                                <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-emerald-900">doctors (FK: department_id, user_id)</div>
                                    <div className="text-muted-foreground text-[11px]">Bio, role, photo, linked admin user</div>
                                </div>
                                <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-emerald-900">doctor_service (Pivot)</div>
                                    <div className="text-muted-foreground text-[11px]">doctor_id ↔ service_id (N:M)</div>
                                </div>
                            </div>
                        </div>

                        {/* Domain 2: Operations & Scheduling */}
                        <div className="bg-card border-2 border-sky-500/30 rounded-2xl p-6 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 text-sky-700 font-bold text-base">
                                <Calendar className="size-5" />
                                <h3>Operations & Scheduling</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Patient directory, appointment bookings, inbound request enquiries, and operating schedules.
                            </p>
                            <div className="space-y-2 pt-2">
                                <div className="p-3 bg-sky-50/50 border border-sky-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-sky-900">patients (FK: user_id)</div>
                                    <div className="text-muted-foreground text-[11px]">Personal details, DOB, clinical notes</div>
                                </div>
                                <div className="p-3 bg-sky-50/50 border border-sky-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-sky-900">appointments</div>
                                    <div className="text-muted-foreground text-[11px]">patient_id, doctor_id, service_id, scheduled_at</div>
                                </div>
                                <div className="p-3 bg-sky-50/50 border border-sky-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-sky-900">appointment_requests</div>
                                    <div className="text-muted-foreground text-[11px]">Inbound public enquiries, read_at status</div>
                                </div>
                                <div className="p-3 bg-sky-50/50 border border-sky-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-sky-900">clinic_hours (FK: department_id)</div>
                                    <div className="text-muted-foreground text-[11px]">day_of_week, opens_at, closes_at</div>
                                </div>
                            </div>
                        </div>

                        {/* Domain 3: CMS & Public Content */}
                        <div className="bg-card border-2 border-amber-500/30 rounded-2xl p-6 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                                <Globe className="size-5" />
                                <h3>CMS & Public Content</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Repeatable dynamic collections, site configuration keys, and patient testimonials.
                            </p>
                            <div className="space-y-2 pt-2">
                                <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-amber-900">content_items</div>
                                    <div className="text-muted-foreground text-[11px]">pillars, faqs, highlights, details</div>
                                </div>
                                <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-amber-900">site_settings</div>
                                    <div className="text-muted-foreground text-[11px]">key-value store for page copy</div>
                                </div>
                                <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-amber-900">testimonials</div>
                                    <div className="text-muted-foreground text-[11px]">patient_id, service_id, rating, review</div>
                                </div>
                            </div>
                        </div>

                        {/* Domain 4: Auth & Security */}
                        <div className="bg-card border-2 border-purple-500/30 rounded-2xl p-6 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 text-purple-700 font-bold text-base">
                                <Shield className="size-5" />
                                <h3>Auth & Security</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Administrator, clinician, and patient authentication, role flags, and passkey credentials.
                            </p>
                            <div className="space-y-2 pt-2">
                                <div className="p-3 bg-purple-50/50 border border-purple-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-purple-900">users</div>
                                    <div className="text-muted-foreground text-[11px]">name, email, password, is_admin, 2FA</div>
                                </div>
                                <div className="p-3 bg-purple-50/50 border border-purple-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-purple-900">passkeys (FK: user_id)</div>
                                    <div className="text-muted-foreground text-[11px]">Biometric WebAuthn keys</div>
                                </div>
                                <div className="p-3 bg-purple-50/50 border border-purple-200/60 rounded-lg text-xs font-medium">
                                    <div className="font-bold text-purple-900">sessions (FK: user_id)</div>
                                    <div className="text-muted-foreground text-[11px]">Active browser session tokens</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Relationship Mapping Table */}
                    <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-2xs space-y-4">
                        <h3 className="font-bold text-base text-ink flex items-center gap-2">
                            <GitFork className="size-4.5 text-primary" />
                            Entity Cardinality & Foreign Key Registry
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                                        <th className="py-2.5 px-3">Parent Table</th>
                                        <th className="py-2.5 px-3">Relationship</th>
                                        <th className="py-2.5 px-3">Child Table</th>
                                        <th className="py-2.5 px-3">Foreign Key Column</th>
                                        <th className="py-2.5 px-3">On Delete Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50 text-ink">
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">departments</td>
                                        <td className="py-2.5 px-3">One-to-Many (1:N)</td>
                                        <td className="py-2.5 px-3 font-medium">services</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">department_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">NULL ON DELETE</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">departments</td>
                                        <td className="py-2.5 px-3">One-to-Many (1:N)</td>
                                        <td className="py-2.5 px-3 font-medium">doctors</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">department_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">NULL ON DELETE</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">departments</td>
                                        <td className="py-2.5 px-3">One-to-Many (1:N)</td>
                                        <td className="py-2.5 px-3 font-medium">clinic_hours</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">department_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">CASCADE</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">doctors ↔ services</td>
                                        <td className="py-2.5 px-3">Many-to-Many (N:M)</td>
                                        <td className="py-2.5 px-3 font-medium">doctor_service</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">doctor_id, service_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">CASCADE</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">users</td>
                                        <td className="py-2.5 px-3">One-to-One (1:1)</td>
                                        <td className="py-2.5 px-3 font-medium">doctors</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">user_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">NULL ON DELETE</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">users</td>
                                        <td className="py-2.5 px-3">One-to-One (1:1)</td>
                                        <td className="py-2.5 px-3 font-medium">patients</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">user_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">NULL ON DELETE</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">patients</td>
                                        <td className="py-2.5 px-3">One-to-Many (1:N)</td>
                                        <td className="py-2.5 px-3 font-medium">appointments</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">patient_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">CASCADE</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">doctors</td>
                                        <td className="py-2.5 px-3">One-to-Many (1:N)</td>
                                        <td className="py-2.5 px-3 font-medium">appointments</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">doctor_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">NULL ON DELETE</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">services</td>
                                        <td className="py-2.5 px-3">One-to-Many (1:N)</td>
                                        <td className="py-2.5 px-3 font-medium">appointments</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">service_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">NULL ON DELETE</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-semibold text-primary">appointment_requests</td>
                                        <td className="py-2.5 px-3">One-to-One (1:1)</td>
                                        <td className="py-2.5 px-3 font-medium">appointments</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">appointment_request_id</td>
                                        <td className="py-2.5 px-3"><Badge variant="outline" className="text-[10px]">NULL ON DELETE</Badge></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Data Dictionary & Schema Explorer */}
            {activeTab === 'dictionary' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Table selector */}
                    <div className="lg:col-span-4 bg-card border border-border/70 rounded-2xl p-5 shadow-2xs space-y-4">
                        <div className="relative">
                            <Search className="size-4 text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search tables..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-xs outline-hidden focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                            {filteredTables.map((table) => (
                                <button
                                    key={table.name}
                                    type="button"
                                    onClick={() => setSelectedTable(table.name)}
                                    className={cn(
                                        'w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between cursor-pointer',
                                        selectedTable === table.name
                                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                                            : 'hover:bg-muted text-ink',
                                    )}
                                >
                                    <div>
                                        <div className="font-mono text-xs">{table.name}</div>
                                        <div className={cn(
                                            'text-[10px]',
                                            selectedTable === table.name ? 'text-primary-foreground/80' : 'text-muted-foreground',
                                        )}>
                                            {table.module}
                                        </div>
                                    </div>
                                    <Badge
                                        variant={selectedTable === table.name ? 'secondary' : 'outline'}
                                        className="text-[10px]"
                                    >
                                        {table.count} rows
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Selected Table Details */}
                    <div className="lg:col-span-8 bg-card border border-border/70 rounded-2xl p-6 shadow-2xs space-y-6">
                        <div>
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="font-mono text-xl font-bold text-primary">
                                    {currentTableData.name}
                                </h3>
                                <Badge variant="secondary">{currentTableData.module}</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mt-1">
                                {currentTableData.description}
                            </p>
                        </div>

                        {/* Columns Table */}
                        <div>
                            <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">
                                Columns Definition ({currentTableData.columns.length})
                            </h4>

                            <div className="border border-border/70 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead className="bg-muted/50 border-b border-border/70">
                                        <tr className="text-muted-foreground font-semibold">
                                            <th className="py-2.5 px-3">Column</th>
                                            <th className="py-2.5 px-3">Type</th>
                                            <th className="py-2.5 px-3">Key</th>
                                            <th className="py-2.5 px-3">Nullable</th>
                                            <th className="py-2.5 px-3">References / Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50 font-mono text-[11px]">
                                        {currentTableData.columns.map((col) => (
                                            <tr key={col.name} className="hover:bg-muted/30">
                                                <td className="py-2 px-3 font-bold text-ink">
                                                    {col.name}
                                                </td>
                                                <td className="py-2 px-3 text-muted-foreground">{col.type}</td>
                                                <td className="py-2 px-3">
                                                    {col.key === 'PK' && (
                                                        <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                                            PK
                                                        </span>
                                                    )}
                                                    {col.key === 'FK' && (
                                                        <span className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                                            FK
                                                        </span>
                                                    )}
                                                    {col.key === 'UNI' && (
                                                        <span className="bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                                            UNIQUE
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-3 text-muted-foreground font-sans">
                                                    {col.nullable ? 'Yes' : 'No'}
                                                </td>
                                                <td className="py-2 px-3 text-muted-foreground font-sans">
                                                    {col.references ? (
                                                        <span className="text-primary font-medium">
                                                            → {col.references}
                                                        </span>
                                                    ) : col.default !== undefined ? (
                                                        <span>Default: {col.default}</span>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Foreign Relationships */}
                        {currentTableData.relationships.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">
                                    Relationships ({currentTableData.relationships.length})
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {currentTableData.relationships.map((rel, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 border border-border/60 rounded-xl bg-muted/20 flex items-center justify-between text-xs"
                                        >
                                            <span className="font-mono font-medium text-primary">
                                                {rel.type} → {rel.target}
                                            </span>
                                            <span className="text-muted-foreground text-[10px] font-mono">
                                                {rel.foreign_key}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tab 3: Mermaid Schema Code */}
            {activeTab === 'mermaid' && (
                <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-base text-ink">Mermaid ERD Specification</h3>
                            <p className="text-xs text-muted-foreground">
                                Use this standard diagram code in Mermaid live editor, Figma Mermaid plugin, GitHub markdown, or documentation.
                            </p>
                        </div>
                        <Button size="sm" onClick={handleCopyMermaid} className="gap-2">
                            {copiedMermaid ? <Check className="size-4" /> : <Copy className="size-4" />}
                            {copiedMermaid ? 'Copied' : 'Copy Code'}
                        </Button>
                    </div>

                    <pre className="bg-zinc-950 text-zinc-100 p-5 rounded-xl font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
                        {mermaidDiagramCode}
                    </pre>
                </div>
            )}
        </div>
    );
}

AdminDatabase.layout = {
    breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Database & ERD', href: '/admin/database' },
    ],
};
