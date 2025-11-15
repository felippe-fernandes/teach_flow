"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

type Contractor = {
  id: string;
  name: string;
};

type ContractorSelectProps = {
  contractors: Contractor[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
};

export function ContractorSelect({
  contractors,
  name = "contractor_id",
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  required = false,
}: ContractorSelectProps) {

  // Converter null/undefined para "__particular__"
  const normalizedValue = value === null || value === undefined || value === "" ? "__particular__" : value;
  const normalizedDefaultValue = defaultValue === null || defaultValue === undefined || defaultValue === "" ? "__particular__" : defaultValue;

  return (
    <>
      <Select
        name={name}
        value={normalizedValue}
        defaultValue={normalizedDefaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__particular__">Particular</SelectItem>
          {contractors.map((contractor) => (
            <SelectItem key={contractor.id} value={contractor.id}>
              {contractor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {contractors.length === 0 && (
        <p className="text-xs text-muted-foreground">
          <Link href="/dashboard/contractors/new" className="text-primary hover:underline">
            Cadastre um contratante
          </Link>{" "}
          para vincular alunos
        </p>
      )}
    </>
  );
}
