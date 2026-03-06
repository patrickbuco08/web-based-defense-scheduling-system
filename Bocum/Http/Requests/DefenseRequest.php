<?php

namespace Bocum\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class DefenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by the controller
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'presentation_type' => ['required', 'string', Rule::in(['title presentation', 'oral', 'final', 'others'])],
            'group_id' => ['required'],
            'room_id' => ['exists:rooms,id'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time', 'min_duration'],
            'notes' => ['nullable', 'string'],
            'panelists' => ['array', 'min:1'],
            'panelists.*' => ['exists:users,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'room_id.required' => 'Please select a room for the defense.',
            'term_id.required' => 'Please select a term for the defense.',
            'date.after_or_equal' => 'The date must be today or in the future.',
            'end_time.after' => 'The end time must be after the start time.',
            'end_time.min_duration' => 'The defense duration must be at least :minutes minutes.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->addExtension('min_duration', function ($attribute, $value, $parameters, $validator) {
            $startTime = $validator->getData()['start_time'] ?? null;
            $endTime = $value;

            if (!$startTime || !$endTime) {
                return true;
            }

            $minDuration = (int) config('defense.min_duration_minutes', 30);

            $start = Carbon::createFromFormat('H:i', $startTime);
            $end = Carbon::createFromFormat('H:i', $endTime);

            $durationInMinutes = $start->diffInMinutes($end);

            return $durationInMinutes >= $minDuration;
        });

        $validator->addReplacer('min_duration', function ($message, $attribute, $rule, $parameters, $validator) {
            $minDuration = (int) config('defense.min_duration_minutes', 30);
            return str_replace(':minutes', $minDuration, $message);
        });
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Ensure panelists is an array
        if ($this->has('panelists') && !is_array($this->panelists)) {
            $this->merge([
                'panelists' => (array) $this->panelists,
            ]);
        }
    }
}
