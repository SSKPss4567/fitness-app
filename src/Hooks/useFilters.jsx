import { useCallback } from "react";

const useFilters = (selectedFilters, setSelectedFilters) => {
  const handleFilterChange = useCallback((filterKey, selectedValue) => {
    setSelectedFilters((prev) => {
      const updatedFilters = prev[filterKey].includes(selectedValue)
        ? prev[filterKey].filter((value) => value !== selectedValue) // Remove if already exists
        : [...prev[filterKey], selectedValue]; // Add if it doesn't exist

      return { ...prev, [filterKey]: updatedFilters };
    });
  }, [setSelectedFilters]);

  return handleFilterChange;
};

export default useFilters;