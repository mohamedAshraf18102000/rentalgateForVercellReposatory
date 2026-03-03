"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/(components)/ui/select";

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const;

const SearchPickUpDialog = () => {
  return (
    <div className="w-full flex gap-2">
      <div className="w-3/4">
        <Input
          className="bg-white! text-sm! rounded-xl"
          type="search"
          placeholder="بحث ..."
          startIcon={<Search className="w-6! h-6!" />}
        />
      </div>

      <div className="w-1/4">
        <Select dir="ltr">
          <SelectTrigger className="w-full rounded-xl border border-Grey200 bg-white hover:bg-Grey50 transition-colors">
            <SelectValue defaultValue="saudi" placeholder="السعودية" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>الدول</SelectLabel>
              <SelectItem value="saudi">السعودية</SelectItem>
              <SelectItem value="emirates">الإمارات</SelectItem>
              <SelectItem value="bahrain">البحرين</SelectItem>
              <SelectItem value="kuwait">الكويت</SelectItem>
              <SelectItem value="qatar">القطر</SelectItem>
              <SelectItem value="egypt">مصر</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchPickUpDialog;
