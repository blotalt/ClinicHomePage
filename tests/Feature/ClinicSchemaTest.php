<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\AppointmentRequest;
use App\Models\ClinicHour;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClinicSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_department_has_doctors_services_and_hours()
    {
        $department = Department::query()->create([
            'name' => 'Primary Care', 'slug' => 'primary-care',
        ]);

        $doctor = Doctor::query()->create([
            'name' => 'Dr. Test', 'slug' => 'dr-test',
            'department_id' => $department->id,
        ]);

        $service = Service::query()->create([
            'title' => 'Consultation', 'department_id' => $department->id,
        ]);

        ClinicHour::query()->create([
            'department_id' => $department->id, 'day_of_week' => 1,
            'opens_at' => '09:00', 'closes_at' => '17:00',
        ]);

        $this->assertTrue($department->doctors->contains($doctor));
        $this->assertTrue($department->services->contains($service));
        $this->assertCount(1, $department->hours);
        $this->assertSame('Primary Care', $doctor->department->name);
    }

    public function test_doctors_and_services_are_many_to_many()
    {
        $doctor = Doctor::query()->create(['name' => 'Dr. A', 'slug' => 'dr-a']);
        $one = Service::query()->create(['title' => 'Service One']);
        $two = Service::query()->create(['title' => 'Service Two']);

        $doctor->services()->sync([$one->id, $two->id]);

        $this->assertCount(2, $doctor->fresh()->services);
        $this->assertTrue($one->fresh()->doctors->contains($doctor));
    }

    public function test_a_service_slug_is_generated_and_kept_unique()
    {
        $first = Service::query()->create(['title' => 'Wellness Exams']);
        $second = Service::query()->create(['title' => 'Wellness Exams']);

        $this->assertSame('wellness-exams', $first->slug);
        $this->assertSame('wellness-exams-2', $second->slug);
    }

    public function test_an_appointment_links_patient_doctor_service_and_request()
    {
        $patient = Patient::query()->create([
            'first_name' => 'Jane', 'last_name' => 'Doe',
            'email' => 'jane@example.com',
        ]);
        $doctor = Doctor::query()->create(['name' => 'Dr. B', 'slug' => 'dr-b']);
        $service = Service::query()->create(['title' => 'Checkup']);
        $request = AppointmentRequest::query()->create([
            'first_name' => 'Jane', 'last_name' => 'Doe',
            'email' => 'jane@example.com', 'message' => 'Hello.',
            'patient_id' => $patient->id, 'service_id' => $service->id,
        ]);

        $appointment = Appointment::query()->create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'service_id' => $service->id,
            'appointment_request_id' => $request->id,
            'scheduled_at' => now()->addDay(),
        ]);

        $this->assertSame('Jane Doe', $appointment->patient->name);
        $this->assertSame('Dr. B', $appointment->doctor->name);
        $this->assertSame('Checkup', $appointment->service->title);
        $this->assertTrue($appointment->request->is($request));
        $this->assertTrue($request->appointment->is($appointment));
        $this->assertTrue($patient->appointments->contains($appointment));
    }

    public function test_deleting_a_doctor_leaves_the_appointment_but_clears_the_link()
    {
        $patient = Patient::query()->create([
            'first_name' => 'A', 'last_name' => 'B', 'email' => 'a@b.com',
        ]);
        $doctor = Doctor::query()->create(['name' => 'Dr. C', 'slug' => 'dr-c']);

        $appointment = Appointment::query()->create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'scheduled_at' => now()->addDay(),
        ]);

        $doctor->delete();

        $this->assertDatabaseHas('appointments', ['id' => $appointment->id]);
        $this->assertNull($appointment->fresh()->doctor_id);
    }

    public function test_deleting_a_patient_removes_their_appointments()
    {
        $patient = Patient::query()->create([
            'first_name' => 'C', 'last_name' => 'D', 'email' => 'c@d.com',
        ]);

        $appointment = Appointment::query()->create([
            'patient_id' => $patient->id,
            'scheduled_at' => now()->addDay(),
        ]);

        $patient->delete();

        $this->assertDatabaseMissing('appointments', ['id' => $appointment->id]);
    }

    public function test_a_doctor_can_be_linked_to_a_login()
    {
        $user = User::factory()->create();
        $doctor = Doctor::query()->create([
            'name' => 'Dr. D', 'slug' => 'dr-d', 'user_id' => $user->id,
        ]);

        $this->assertTrue($doctor->user->is($user));
    }

    public function test_testimonials_belong_to_a_patient_and_a_service()
    {
        $patient = Patient::query()->create([
            'first_name' => 'E', 'last_name' => 'F', 'email' => 'e@f.com',
        ]);
        $service = Service::query()->create(['title' => 'Therapy']);

        $testimonial = Testimonial::query()->create([
            'patient_id' => $patient->id,
            'service_id' => $service->id,
            'author_name' => 'E. F.',
            'rating' => 5,
            'is_published' => true,
        ]);

        $this->assertTrue($testimonial->patient->is($patient));
        $this->assertTrue($testimonial->service->is($service));
        $this->assertCount(1, Testimonial::query()->published()->get());
    }
}
