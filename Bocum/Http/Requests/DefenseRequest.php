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
            'group_code' => ['required', 'string', 'max:50'],
            'room_id' => ['required', 'exists:rooms,id'],
            'term_id' => ['required', 'exists:terms,id'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'description' => ['nullable', 'string'],
            'adviser_id' => ['required', 'exists:users,id'],
            'panelists' => ['required', 'array', 'min:1'],
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
        ];
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
