"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { CustomTooltipProps } from "./types/tooltipTypes";

const CustomTooltip: React.FC<CustomTooltipProps> = ({ content, children }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="TooltipContent py-2 px-4 bg-black/80 rounded-md text-white text-sm"
            side="right"
            sideOffset={5}
          >
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default CustomTooltip;
