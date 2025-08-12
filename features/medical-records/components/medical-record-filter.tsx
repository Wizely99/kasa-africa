import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFilterCardProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleFilterChange: (filterName: string, value?: string) => void;
  clearFilters: () => void;
  recordTypeOptions: FilterOption[];
  ocrStatusOptions: FilterOption[];
}

export function SearchAndFilterCard({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleFilterChange,
  clearFilters,
  recordTypeOptions,
  ocrStatusOptions,
}: SearchAndFilterCardProps) {
  return (
    <div className=" ">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {/* Search */}
            <div className="flex gap-2 justify-between">
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-grow"
              />
              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Record Type Filter */}
            <div className="grid grid-cols-3 gap-2">
              <Select
                onValueChange={(value) =>
                  handleFilterChange(
                    "recordType",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Record Type" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  handleFilterChange(
                    "ocrStatus",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="OCR Status" />
                </SelectTrigger>
                <SelectContent>
                  {ocrStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
