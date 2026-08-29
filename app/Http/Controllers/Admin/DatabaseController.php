<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentRequest;
use App\Models\ClinicHour;
use App\Models\ContentItem;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DatabaseController extends Controller
{
    public function index(): Response
    {
        $tables = [
            [
                'name' => 'departments',
                'module' => 'Clinical Structure',
                'count' => Department::query()->count(),
                'description' => 'Clinical divisions organizing medical services and practitioners (e.g. Primary Care, Nutrition, Integrative Therapy).',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'name', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'slug', 'type' => 'varchar(120)', 'key' => 'UNI', 'nullable' => false],
                    ['name' => 'description', 'type' => 'text', 'key' => '', 'nullable' => true],
                    ['name' => 'icon', 'type' => 'varchar(64)', 'key' => '', 'nullable' => true],
                    ['name' => 'position', 'type' => 'int unsigned', 'key' => '', 'nullable' => false, 'default' => '0'],
                    ['name' => 'is_published', 'type' => 'boolean', 'key' => '', 'nullable' => false, 'default' => '1'],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'hasMany', 'target' => 'services', 'foreign_key' => 'services.department_id'],
                    ['type' => 'hasMany', 'target' => 'doctors', 'foreign_key' => 'doctors.department_id'],
                    ['type' => 'hasMany', 'target' => 'clinic_hours', 'foreign_key' => 'clinic_hours.department_id'],
                ],
            ],
            [
                'name' => 'services',
                'module' => 'Clinical Structure',
                'count' => Service::query()->count(),
                'description' => 'Healthcare offerings and treatments provided at the clinic (duration, price, features).',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'department_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'departments.id'],
                    ['name' => 'title', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'slug', 'type' => 'varchar(160)', 'key' => 'UNI', 'nullable' => false],
                    ['name' => 'body', 'type' => 'longtext', 'key' => '', 'nullable' => true],
                    ['name' => 'icon', 'type' => 'varchar(64)', 'key' => '', 'nullable' => true],
                    ['name' => 'image_path', 'type' => 'varchar(255)', 'key' => '', 'nullable' => true],
                    ['name' => 'duration_minutes', 'type' => 'smallint unsigned', 'key' => '', 'nullable' => true],
                    ['name' => 'price', 'type' => 'decimal(8,2)', 'key' => '', 'nullable' => true],
                    ['name' => 'meta', 'type' => 'json', 'key' => '', 'nullable' => true],
                    ['name' => 'position', 'type' => 'int unsigned', 'key' => '', 'nullable' => false, 'default' => '0'],
                    ['name' => 'is_published', 'type' => 'boolean', 'key' => '', 'nullable' => false, 'default' => '1'],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'belongsTo', 'target' => 'departments', 'foreign_key' => 'services.department_id'],
                    ['type' => 'belongsToMany', 'target' => 'doctors', 'foreign_key' => 'doctor_service'],
                    ['type' => 'hasMany', 'target' => 'appointments', 'foreign_key' => 'appointments.service_id'],
                    ['type' => 'hasMany', 'target' => 'appointment_requests', 'foreign_key' => 'appointment_requests.service_id'],
                    ['type' => 'hasMany', 'target' => 'testimonials', 'foreign_key' => 'testimonials.service_id'],
                ],
            ],
            [
                'name' => 'doctors',
                'module' => 'Clinical Structure',
                'count' => Doctor::query()->count(),
                'description' => 'Medical practitioners and clinical staff members with bios, specialties, and user links.',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'department_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'departments.id'],
                    ['name' => 'user_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'users.id'],
                    ['name' => 'name', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'slug', 'type' => 'varchar(160)', 'key' => 'UNI', 'nullable' => false],
                    ['name' => 'title', 'type' => 'varchar(255)', 'key' => '', 'nullable' => true],
                    ['name' => 'bio', 'type' => 'longtext', 'key' => '', 'nullable' => true],
                    ['name' => 'photo_path', 'type' => 'varchar(255)', 'key' => '', 'nullable' => true],
                    ['name' => 'email', 'type' => 'varchar(255)', 'key' => '', 'nullable' => true],
                    ['name' => 'position', 'type' => 'int unsigned', 'key' => '', 'nullable' => false, 'default' => '0'],
                    ['name' => 'is_published', 'type' => 'boolean', 'key' => '', 'nullable' => false, 'default' => '1'],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'belongsTo', 'target' => 'departments', 'foreign_key' => 'doctors.department_id'],
                    ['type' => 'belongsTo', 'target' => 'users', 'foreign_key' => 'doctors.user_id'],
                    ['type' => 'belongsToMany', 'target' => 'services', 'foreign_key' => 'doctor_service'],
                    ['type' => 'hasMany', 'target' => 'appointments', 'foreign_key' => 'appointments.doctor_id'],
                    ['type' => 'hasMany', 'target' => 'appointment_requests', 'foreign_key' => 'appointment_requests.doctor_id'],
                ],
            ],
            [
                'name' => 'doctor_service',
                'module' => 'Clinical Structure',
                'count' => DB::table('doctor_service')->count(),
                'description' => 'Pivot table establishing the Many-to-Many relationship between Doctors and Services.',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'doctor_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => false, 'references' => 'doctors.id'],
                    ['name' => 'service_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => false, 'references' => 'services.id'],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'belongsTo', 'target' => 'doctors', 'foreign_key' => 'doctor_service.doctor_id'],
                    ['type' => 'belongsTo', 'target' => 'services', 'foreign_key' => 'doctor_service.service_id'],
                ],
            ],
            [
                'name' => 'patients',
                'module' => 'Patient Management',
                'count' => Patient::query()->count(),
                'description' => 'Patient records with personal details, clinical notes, and optional user portal link.',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'user_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'users.id'],
                    ['name' => 'first_name', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'last_name', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'email', 'type' => 'varchar(255)', 'key' => 'MUL', 'nullable' => false],
                    ['name' => 'phone', 'type' => 'varchar(40)', 'key' => '', 'nullable' => true],
                    ['name' => 'date_of_birth', 'type' => 'date', 'key' => '', 'nullable' => true],
                    ['name' => 'notes', 'type' => 'text', 'key' => '', 'nullable' => true],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'belongsTo', 'target' => 'users', 'foreign_key' => 'patients.user_id'],
                    ['type' => 'hasMany', 'target' => 'appointments', 'foreign_key' => 'appointments.patient_id'],
                    ['type' => 'hasMany', 'target' => 'appointment_requests', 'foreign_key' => 'appointment_requests.patient_id'],
                    ['type' => 'hasMany', 'target' => 'testimonials', 'foreign_key' => 'testimonials.patient_id'],
                ],
            ],
            [
                'name' => 'appointments',
                'module' => 'Scheduling & Bookings',
                'count' => Appointment::query()->count(),
                'description' => 'Confirmed medical sessions linking a patient, practitioner, service, and scheduled time.',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'patient_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => false, 'references' => 'patients.id'],
                    ['name' => 'doctor_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'doctors.id'],
                    ['name' => 'service_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'services.id'],
                    ['name' => 'appointment_request_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'appointment_requests.id'],
                    ['name' => 'scheduled_at', 'type' => 'datetime', 'key' => 'MUL', 'nullable' => false],
                    ['name' => 'duration_minutes', 'type' => 'smallint unsigned', 'key' => '', 'nullable' => false, 'default' => '30'],
                    ['name' => 'status', 'type' => 'varchar(32)', 'key' => '', 'nullable' => false, 'default' => 'scheduled'],
                    ['name' => 'notes', 'type' => 'text', 'key' => '', 'nullable' => true],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'belongsTo', 'target' => 'patients', 'foreign_key' => 'appointments.patient_id'],
                    ['type' => 'belongsTo', 'target' => 'doctors', 'foreign_key' => 'appointments.doctor_id'],
                    ['type' => 'belongsTo', 'target' => 'services', 'foreign_key' => 'appointments.service_id'],
                    ['type' => 'belongsTo', 'target' => 'appointment_requests', 'foreign_key' => 'appointments.appointment_request_id'],
                ],
            ],
            [
                'name' => 'appointment_requests',
                'module' => 'Scheduling & Bookings',
                'count' => AppointmentRequest::query()->count(),
                'description' => 'Inbound consultation booking enquiries submitted via the public Contact & Booking forms.',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'first_name', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'last_name', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'email', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'phone', 'type' => 'varchar(255)', 'key' => '', 'nullable' => true],
                    ['name' => 'service_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'services.id'],
                    ['name' => 'doctor_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'doctors.id'],
                    ['name' => 'patient_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'patients.id'],
                    ['name' => 'service', 'type' => 'varchar(255)', 'key' => '', 'nullable' => true],
                    ['name' => 'message', 'type' => 'text', 'key' => '', 'nullable' => false],
                    ['name' => 'read_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'belongsTo', 'target' => 'services', 'foreign_key' => 'appointment_requests.service_id'],
                    ['type' => 'belongsTo', 'target' => 'doctors', 'foreign_key' => 'appointment_requests.doctor_id'],
                    ['type' => 'belongsTo', 'target' => 'patients', 'foreign_key' => 'appointment_requests.patient_id'],
                    ['type' => 'hasOne', 'target' => 'appointments', 'foreign_key' => 'appointments.appointment_request_id'],
                ],
            ],
            [
                'name' => 'clinic_hours',
                'module' => 'Operations',
                'count' => ClinicHour::query()->count(),
                'description' => 'Operating schedules and open/close hours per day for the clinic or specific departments.',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'department_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'departments.id'],
                    ['name' => 'day_of_week', 'type' => 'tinyint unsigned', 'key' => 'MUL', 'nullable' => false],
                    ['name' => 'opens_at', 'type' => 'time', 'key' => '', 'nullable' => true],
                    ['name' => 'closes_at', 'type' => 'time', 'key' => '', 'nullable' => true],
                    ['name' => 'is_closed', 'type' => 'boolean', 'key' => '', 'nullable' => false, 'default' => '0'],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'belongsTo', 'target' => 'departments', 'foreign_key' => 'clinic_hours.department_id'],
                ],
            ],
            [
                'name' => 'testimonials',
                'module' => 'Public Content & Reviews',
                'count' => Testimonial::query()->count(),
                'description' => 'Patient reviews, ratings, and social proof linked to services or practitioners.',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'patient_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'patients.id'],
                    ['name' => 'service_id', 'type' => 'bigint unsigned', 'key' => 'FK', 'nullable' => true, 'references' => 'services.id'],
                    ['name' => 'author_name', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'rating', 'type' => 'tinyint unsigned', 'key' => '', 'nullable' => false, 'default' => '5'],
                    ['name' => 'body', 'type' => 'longtext', 'key' => '', 'nullable' => true],
                    ['name' => 'position', 'type' => 'int unsigned', 'key' => '', 'nullable' => false, 'default' => '0'],
                    ['name' => 'is_published', 'type' => 'boolean', 'key' => '', 'nullable' => false, 'default' => '0'],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'belongsTo', 'target' => 'patients', 'foreign_key' => 'testimonials.patient_id'],
                    ['type' => 'belongsTo', 'target' => 'services', 'foreign_key' => 'testimonials.service_id'],
                ],
            ],
            [
                'name' => 'content_items',
                'module' => 'Public Content & CMS',
                'count' => ContentItem::query()->count(),
                'description' => 'Dynamic repeatable content collections (Philosophy pillars, FAQs, Home highlights, Clinic details).',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'collection', 'type' => 'varchar(255)', 'key' => 'MUL', 'nullable' => false],
                    ['name' => 'title', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'body', 'type' => 'longtext', 'key' => '', 'nullable' => true],
                    ['name' => 'icon', 'type' => 'varchar(255)', 'key' => '', 'nullable' => true],
                    ['name' => 'image_path', 'type' => 'varchar(255)', 'key' => '', 'nullable' => true],
                    ['name' => 'meta', 'type' => 'json', 'key' => '', 'nullable' => true],
                    ['name' => 'position', 'type' => 'int unsigned', 'key' => '', 'nullable' => false, 'default' => '0'],
                    ['name' => 'is_published', 'type' => 'boolean', 'key' => '', 'nullable' => false, 'default' => '1'],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [],
            ],
            [
                'name' => 'site_settings',
                'module' => 'Site Configuration',
                'count' => SiteSetting::query()->count(),
                'description' => 'Key-value configuration store for site-wide settings and single-page section copy.',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'key', 'type' => 'varchar(255)', 'key' => 'UNI', 'nullable' => false],
                    ['name' => 'group', 'type' => 'varchar(255)', 'key' => 'MUL', 'nullable' => false],
                    ['name' => 'value', 'type' => 'longtext', 'key' => '', 'nullable' => true],
                    ['name' => 'type', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false, 'default' => 'text'],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [],
            ],
            [
                'name' => 'users',
                'module' => 'Authentication & Access',
                'count' => User::query()->count(),
                'description' => 'System accounts for administrators, staff, doctors, and authenticated portal patients.',
                'columns' => [
                    ['name' => 'id', 'type' => 'bigint unsigned', 'key' => 'PK', 'nullable' => false],
                    ['name' => 'name', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'email', 'type' => 'varchar(255)', 'key' => 'UNI', 'nullable' => false],
                    ['name' => 'email_verified_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'password', 'type' => 'varchar(255)', 'key' => '', 'nullable' => false],
                    ['name' => 'is_admin', 'type' => 'boolean', 'key' => '', 'nullable' => false, 'default' => '0'],
                    ['name' => 'two_factor_confirmed_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'created_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                    ['name' => 'updated_at', 'type' => 'timestamp', 'key' => '', 'nullable' => true],
                ],
                'relationships' => [
                    ['type' => 'hasOne', 'target' => 'doctors', 'foreign_key' => 'doctors.user_id'],
                    ['type' => 'hasOne', 'target' => 'patients', 'foreign_key' => 'patients.user_id'],
                ],
            ],
        ];

        return Inertia::render('admin/database', [
            'tables' => $tables,
            'totalRecords' => array_sum(array_column($tables, 'count')),
            'totalTables' => count($tables),
            'driver' => DB::connection()->getDriverName(),
        ]);
    }
}
