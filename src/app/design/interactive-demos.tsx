"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Copy,
  Keyboard,
  LogOut,
  MoreHorizontal,
  Settings,
  Share2,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { SearchButton } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ControlsDemo() {
  const [range, setRange] = useState("28");
  const [weeklySummary, setWeeklySummary] = useState(true);

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center gap-4">
        <SegmentedControl aria-label="Date range" value={range} onValueChange={setRange}>
          <SegmentedControlItem value="7">7D</SegmentedControlItem>
          <SegmentedControlItem value="28">28D</SegmentedControlItem>
          <SegmentedControlItem value="90">90D</SegmentedControlItem>
        </SegmentedControl>
        <p className="text-sm text-muted-foreground">Showing the last {range} days</p>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="design-weekly-summary"
          checked={weeklySummary}
          onCheckedChange={setWeeklySummary}
        />
        <Label htmlFor="design-weekly-summary">Email me a weekly summary</Label>
      </div>

      <Tabs defaultValue="overview" className="max-w-xl">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-sm text-muted-foreground">
          Views, reach and saves for this reel.
        </TabsContent>
        <TabsContent value="retention" className="text-sm text-muted-foreground">
          How many people kept watching, second by second.
        </TabsContent>
        <TabsContent value="comments" className="text-sm text-muted-foreground">
          What people said, newest first.
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function OverlayDemo() {
  const [sortBy, setSortBy] = useState("views");
  const [showArchived, setShowArchived] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Instagram?</DialogTitle>
            <DialogDescription>
              Hookline will stop syncing new posts. Your scripts and past stats stay where they are.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() =>
                  toast.success("Disconnected", { description: "Demo only: nothing changed." })
                }
              >
                Disconnect
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <ArrowUpDown />
            Sort & view
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuLabel>Sort reels by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
            <DropdownMenuRadioItem value="views">Views</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="saves">Saves</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="hook-hold">Hook hold</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
            Show archived
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" aria-label="Account menu">
            <User />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard />
            Shortcuts
            <DropdownMenuShortcut>?</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">
            <SlidersHorizontal />
            Set a goal
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="grid gap-3">
          <div className="grid gap-1">
            <p className="text-sm font-medium">Views goal</p>
            <p className="text-xs text-muted-foreground">Progress shows up on your dashboard.</p>
          </div>
          <Label htmlFor="design-goal" className="sr-only">
            Views goal
          </Label>
          <Input id="design-goal" inputMode="numeric" placeholder="100,000" />
          <Button size="sm" onClick={() => toast("Goal saved", { description: "Demo only." })}>
            Save goal
          </Button>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy link"
              onClick={() => toast.success("Link copied")}
            >
              <Copy />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy link</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Share">
              <Share2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More options">
              <MoreHorizontal />
            </Button>
          </TooltipTrigger>
          <TooltipContent>More</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export function ToastDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast.success("Script saved", { description: "Why your hook dies in 3 seconds" })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error("Sync failed", {
            description: "Instagram did not respond. Retrying in 5 minutes.",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.info("New reel found", { description: "Hookline started tracking it." })
        }
      >
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast("Reel archived", {
            action: { label: "Undo", onClick: () => toast.success("Restored") },
          })
        }
      >
        With undo
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1600)), {
            loading: "Syncing your reels…",
            success: "All caught up",
            error: "Sync failed",
          })
        }
      >
        Loading
      </Button>
    </div>
  );
}

export function CommandDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchButton />
      <p className="text-sm text-muted-foreground">or press the shortcut on any page.</p>
    </div>
  );
}
