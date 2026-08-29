<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\ClinicHour;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Service;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Sample clinical data: departments, practitioners, patients and bookings.
 * Safe to re-run — every table is only filled when it is empty.
 */
class ClinicSeeder extends Seeder
{
    public function run(): void
    {
        $departments = $this->seedDepartments();
        $this->attachServicesToDepartments($departments);
        $doctors = $this->seedDoctors($departments);
        $this->seedHours();
        $this->seedPatientsAndAppointments($doctors);
        $this->seedTestimonials();
    }

    /**
     * @return array<string, Department>
     */
    private function seedDepartments(): array
    {
        $rows = [
            ['name' => 'Primary Care', 'icon' => 'Stethoscope', 'description' => 'Everyday medicine for the whole family.'],
            ['name' => 'Mental Wellness', 'icon' => 'Brain', 'description' => 'Counselling and psychological support.'],
            ['name' => 'Nutrition', 'icon' => 'Apple', 'description' => 'Dietary planning and metabolic health.'],
            ['name' => 'Integrative Therapy', 'icon' => 'Sprout', 'description' => 'Evidence-based complementary care.'],
        ];

        $departments = [];

        foreach ($rows as $position => $row) {
            $departments[$row['name']] = Department::query()->firstOrCreate(
                ['slug' => Str::slug($row['name'])],
                [...$row, 'position' => $position, 'is_published' => true],
            );
        }

        return $departments;
    }

    /**
     * @param  array<string, Department>  $departments
     */
    private function attachServicesToDepartments(array $departments): void
    {
        $map = [
            'General Consultation' => 'Primary Care',
            'Wellness Exams' => 'Primary Care',
            'Minor Procedures' => 'Primary Care',
            'Telehealth' => 'Primary Care',
            'Nutritional Counseling' => 'Nutrition',
            'Holistic Therapy' => 'Integrative Therapy',
        ];

        $durations = [
            'General Consultation' => 30,
            'Wellness Exams' => 45,
            'Minor Procedures' => 60,
            'Telehealth' => 20,
            'Nutritional Counseling' => 45,
            'Holistic Therapy' => 60,
        ];

        foreach ($map as $service => $department) {
            Service::query()
                ->where('title', $service)
                ->whereNull('department_id')
                ->update([
                    'department_id' => $departments[$department]->id,
                    'duration_minutes' => $durations[$service] ?? 30,
                ]);
        }
    }

    /**
     * @param  array<string, Department>  $departments
     * @return array<string, Doctor>
     */
    private function seedDoctors(array $departments): array
    {
        $rows = [
            [
                'name' => 'Dr. Sarah Jenkins',
                'title' => 'LEAD NATUROPATH',
                'department' => 'Primary Care',
                'services' => ['General Consultation', 'Wellness Exams', 'Telehealth'],
                'photo_path' => '/images/doctors/sarah-jenkins.svg',
                'bio' => '<p>With over 15 years of experience in holistic medicine, Dr. Jenkins believes that true healing happens when the body and mind are at ease. She leads our clinical practice with a focus on preventative care and natural therapies.</p>',
            ],
            [
                'name' => 'Michael Chen, L.Ac.',
                'title' => 'ACUPUNCTURIST & HERBALIST',
                'department' => 'Integrative Therapy',
                'services' => ['Holistic Therapy'],
                'photo_path' => '/images/doctors/michael-chen.svg',
                'bio' => '<p>Michael blends traditional Eastern practices with a modern understanding of physiology. His gentle approach to acupuncture and custom herbal formulations aims to restore balance and harmony to the whole person.</p>',
            ],
            [
                'name' => 'Dr. Marcus Idowu',
                'title' => 'Family Physician',
                'department' => 'Primary Care',
                'services' => ['General Consultation', 'Minor Procedures'],
                'photo_path' => '/images/doctors/michael-chen.svg',
                'bio' => '<p>Marcus focuses on chronic condition management and in-clinic procedures.</p>',
            ],
            [
                'name' => 'Dr. Aiko Tanaka',
                'title' => 'Clinical Psychologist',
                'department' => 'Mental Wellness',
                'services' => ['Holistic Therapy'],
                'photo_path' => '/images/doctors/sarah-jenkins.svg',
                'bio' => '<p>Aiko works with anxiety, burnout and stress-related presentations.</p>',
            ],
            [
                'name' => 'Priya Raman, RD',
                'title' => 'Registered Dietitian',
                'department' => 'Nutrition',
                'services' => ['Nutritional Counseling'],
                'photo_path' => '/images/doctors/sarah-jenkins.svg',
                'bio' => '<p>Priya builds sustainable dietary plans around real life, not ideal weeks.</p>',
            ],
        ];

        $doctors = [];

        foreach ($rows as $position => $row) {
            $doctor = Doctor::query()->updateOrCreate(
                ['slug' => Str::slug($row['name'])],
                [
                    'name' => $row['name'],
                    'title' => $row['title'],
                    'bio' => $row['bio'],
                    'photo_path' => $row['photo_path'] ?? null,
                    'department_id' => $departments[$row['department']]->id,
                    'position' => $position,
                    'is_published' => true,
                ],
            );

            $serviceIds = Service::query()
                ->whereIn('title', $row['services'])
                ->pluck('id');

            $doctor->services()->syncWithoutDetaching($serviceIds);

            $doctors[$row['name']] = $doctor;
        }

        return $doctors;
    }

    private function seedHours(): void
    {
        if (ClinicHour::query()->exists()) {
            return;
        }

        foreach (range(0, 6) as $day) {
            $weekend = in_array($day, [0, 6], true);

            ClinicHour::query()->create([
                'department_id' => null,
                'day_of_week' => $day,
                'opens_at' => $weekend ? null : '09:00',
                'closes_at' => $weekend ? null : '18:00',
                'is_closed' => $weekend,
            ]);
        }
    }

    /**
     * @param  array<string, Doctor>  $doctors
     */
    private function seedPatientsAndAppointments(array $doctors): void
    {
        if (Patient::query()->exists()) {
            return;
        }

        $rows = [
            ['first_name' => 'Elena', 'last_name' => 'Marsh', 'email' => 'elena.marsh@example.com', 'phone' => '(503) 555-0142'],
            ['first_name' => 'Tom', 'last_name' => 'Whitfield', 'email' => 'tom.w@example.com', 'phone' => '(503) 555-0188'],
            ['first_name' => 'Naomi', 'last_name' => 'Clark', 'email' => 'naomi.clark@example.com', 'phone' => null],
        ];

        $services = Service::query()->pluck('id', 'title');
        $doctorList = array_values($doctors);

        foreach ($rows as $index => $row) {
            $patient = Patient::query()->create($row);

            Appointment::query()->create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctorList[$index % count($doctorList)]->id,
                'service_id' => $services->values()[$index % $services->count()],
                'scheduled_at' => now()->addDays($index + 1)->setTime(10 + $index, 0),
                'duration_minutes' => 30,
                'status' => ['scheduled', 'confirmed', 'completed'][$index] ?? 'scheduled',
            ]);
        }
    }

    private function seedTestimonials(): void
    {
        if (Testimonial::query()->exists()) {
            return;
        }

        $patients = Patient::query()->get();
        $services = Service::query()->get();

        $rows = [
            ['author_name' => 'Elena M.', 'rating' => 5, 'body' => '<p>The unhurried consultation made all the difference. I never felt rushed.</p>'],
            ['author_name' => 'Tom W.', 'rating' => 5, 'body' => '<p>Booking was simple and the clinic genuinely feels like a living room.</p>'],
            ['author_name' => 'Naomi C.', 'rating' => 4, 'body' => '<p>Practical nutrition advice that fits around a full-time job.</p>'],
        ];

        foreach ($rows as $position => $row) {
            Testimonial::query()->create([
                ...$row,
                'patient_id' => $patients[$position]->id ?? null,
                'service_id' => $services[$position]->id ?? null,
                'position' => $position,
                'is_published' => true,
            ]);
        }
    }
}
