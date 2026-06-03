"use client";
import { Button, DialogWrapper, Input } from "@/app/(components)";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type SearchDialogProps = {
  onSearch: (name: string) => void;
};

const SearchDialog = ({ onSearch }: SearchDialogProps) => {
  const t = useTranslations("home");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    onSearch(search);
    setOpen(false);
  };

  const handleClear = () => {
    setSearch("");
    onSearch("");
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      className="top-[25%]"
      overlayClassName="bg-black/80"
      trigger={
        <div className="relative">
          <Button type="button" className="w-full shrink-0 sm:w-auto">
            <Search />
          </Button>
          {search.length > 0 && (
            <div className="absolute -top-0.5 -right-0.5 bg-Grey700 w-3 h-3 rounded-full animate-pulse" />
          )}
        </div>
      }
      size="lg"
      content={
        <div className="flex items-center justify-between gap-2 rounded-lg! bg-Grey100 px-2 py-1">
          <Input
            type="text"
            placeholder={t("bookings.searchForm.carSearchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="outline-none focus:ring-0 text-base!  ring-0! border-0! bg-transparent!"
          />
          {search.length > 0 && (
            <X
              className="w-4 h-4 cursor-pointer! text-Grey500"
              onClick={handleClear}
            />
          )}
          <button
            type="button"
            onClick={handleSearch}
            aria-label={t("bookings.searchForm.search")}
            className="w-10 h-10 bg-black text-white rounded-xl p-0.5 cursor-pointer flex items-center justify-center"
          >
            <Search className="w-7 h-7" />
          </button>
        </div>
      }
    />
  );
};

export default SearchDialog;
