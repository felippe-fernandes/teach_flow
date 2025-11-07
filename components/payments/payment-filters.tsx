"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FilterPreset = "all" | "future" | "last7" | "last30" | "thisMonth" | "lastMonth" | "custom";

interface PaymentFiltersProps {
  onFilterChange: (startDate: Date | null, endDate: Date | null) => void;
}

export function PaymentFilters({ onFilterChange }: PaymentFiltersProps) {
  const [selectedPreset, setSelectedPreset] = useState<FilterPreset>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const applyPreset = (preset: FilterPreset) => {
    setSelectedPreset(preset);
    const now = new Date();

    switch (preset) {
      case "all": {
        onFilterChange(null, null);
        setCustomStartDate("");
        setCustomEndDate("");
        break;
      }
      case "future": {
        // A receber - de hoje em diante
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        onFilterChange(today, null);
        setCustomStartDate("");
        setCustomEndDate("");
        break;
      }
      case "last7": {
        const start = new Date(now);
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        onFilterChange(start, now);
        setCustomStartDate("");
        setCustomEndDate("");
        break;
      }
      case "last30": {
        const start = new Date(now);
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        onFilterChange(start, now);
        setCustomStartDate("");
        setCustomEndDate("");
        break;
      }
      case "thisMonth": {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        onFilterChange(start, end);
        setCustomStartDate("");
        setCustomEndDate("");
        break;
      }
      case "lastMonth": {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        end.setHours(23, 59, 59, 999);
        onFilterChange(start, end);
        setCustomStartDate("");
        setCustomEndDate("");
        break;
      }
      case "custom": {
        // Apply filter when custom dates are set
        break;
      }
    }
  };

  const applyCustomDates = () => {
    setSelectedPreset("custom");
    const startDate = customStartDate ? new Date(customStartDate) : null;
    const endDate = customEndDate ? new Date(customEndDate) : null;
    onFilterChange(startDate, endDate);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedPreset === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("all")}
        >
          Todos
        </Button>
        <Button
          variant={selectedPreset === "future" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("future")}
        >
          A Receber
        </Button>
        <Button
          variant={selectedPreset === "last7" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("last7")}
        >
          Últimos 7 dias
        </Button>
        <Button
          variant={selectedPreset === "last30" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("last30")}
        >
          Últimos 30 dias
        </Button>
        <Button
          variant={selectedPreset === "thisMonth" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("thisMonth")}
        >
          Este Mês
        </Button>
        <Button
          variant={selectedPreset === "lastMonth" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("lastMonth")}
        >
          Mês Passado
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="start-date">Data inicial</Label>
          <Input
            id="start-date"
            type="date"
            value={customStartDate}
            onChange={(e) => {
              setCustomStartDate(e.target.value);
              setSelectedPreset("custom");
            }}
            className="w-40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">Data final</Label>
          <Input
            id="end-date"
            type="date"
            value={customEndDate}
            onChange={(e) => {
              setCustomEndDate(e.target.value);
              setSelectedPreset("custom");
            }}
            min={customStartDate}
            className="w-40"
          />
        </div>

        {selectedPreset === "custom" && (customStartDate || customEndDate) && (
          <Button size="sm" onClick={applyCustomDates}>
            Aplicar
          </Button>
        )}
      </div>
    </div>
  );
}
