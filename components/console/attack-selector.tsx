"use client";

import CheckRounded from "@mui/icons-material/CheckRounded";
import CloudOutlined from "@mui/icons-material/CloudOutlined";
import GpsFixedRounded from "@mui/icons-material/GpsFixedRounded";
import { ButtonBase } from "@mui/material";
import { attackCatalog } from "./config";

type AttackSelectorProps = {
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
};

export function AttackSelector({ selected, onToggle }: AttackSelectorProps) {
  return (
    <div className="attack-grid" role="group" aria-label="Attack catalog">
      {attackCatalog.map((attack) => {
        const active = selected.has(attack.id);
        return (
          <ButtonBase
            key={attack.id}
            className={active ? "attack-chip is-selected" : "attack-chip"}
            onClick={() => onToggle(attack.id)}
            aria-pressed={active}
            focusRipple
          >
            <span>
              {attack.kind === "corruption" ? (
                <CloudOutlined fontSize="small" />
              ) : (
                <GpsFixedRounded fontSize="small" />
              )}
            </span>
            <b>{attack.label}</b>
            <i aria-hidden="true">{active && <CheckRounded fontSize="small" />}</i>
          </ButtonBase>
        );
      })}
    </div>
  );
}
