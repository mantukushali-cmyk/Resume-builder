import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

const LanguagesForm = ({ data, onChange }) => {

  const safeData = Array.isArray(data) ? data : [];

  const addLanguage = () => {
    onChange([
      ...safeData,
      { name: "", level: "" }
    ]);
  };

  const removeLanguage = (index) => {
    const updated = safeData.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...safeData];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Languages</h3>
        <button
          onClick={addLanguage}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded"
        >
          <Plus className="size-4" />
          Add Language
        </button>
      </div>

      {safeData.length > 0 ? (
        safeData.map((lang, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-3">

            <div className="flex justify-between">
              <span>Language #{index + 1}</span>
              <button onClick={() => removeLanguage(index)}>
                <Trash2 className="size-4 text-red-500" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Language (e.g. English)"
              value={lang.name || ""}
              onChange={(e) =>
                updateLanguage(index, "name", e.target.value)
              }
              className="w-full px-3 py-2 border rounded"
            />

            <select
              value={lang.level || ""}
              onChange={(e) =>
                updateLanguage(index, "level", e.target.value)
              }
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Proficiency</option>
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Fluent">Fluent</option>
              <option value="Native">Native</option>
            </select>

          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">
          No languages added yet.
        </p>
      )}

    </div>
  );
};

export default LanguagesForm;