"use client"

import { cva } from "class-variance-authority"
import { XIcon } from "lucide-react"
import {
  Button as AriaButton,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagGroupProps as AriaTagGroupProps,
  TagList as AriaTagList,
  TagListProps as AriaTagListProps,
  TagProps as AriaTagProps,
  composeRenderProps,
  Text,
} from "react-aria-components"

import { cn } from "@/lib/utils"

import { Label } from "@/components/ui/field"

const TagGroup = AriaTagGroup

function TagList<T extends object>({
  className,
  ...props
}: AriaTagListProps<T>) {
  return (
    <AriaTagList
      className={composeRenderProps(className, (className) =>
        cn(
          "flex flex-wrap gap-2",
          /* Empty */
          "data-[empty]:text-sm data-[empty]:text-muted-foreground",
          className
        )
      )}
      {...props}
    />
  )
}

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ring-offset-background transition-all duration-200",
    /* Focus */
    "data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-1",
    /* Disabled */
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-transparent bg-blue-500 text-white shadow-sm",
          /* Hover */
          "data-[hovered]:bg-blue-600 data-[hovered]:shadow-md",
        ],
        secondary: [
          "border-gray-200 bg-gray-50 text-gray-700",
          /* Hover */
          "data-[hovered]:bg-gray-100 data-[hovered]:border-gray-300",
        ],
        destructive: [
          "border-transparent bg-destructive text-destructive-foreground",
          /* Hover */
          "data-[hovered]:bg-destructive/80",
        ],
        outline: "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Tag({ children, className, ...props }: AriaTagProps) {
  let textValue = typeof children === "string" ? children : undefined
  return (
    <AriaTag
      textValue={textValue}
      className={composeRenderProps(className, (className, renderProps) =>
        cn(
          badgeVariants({
            variant:
              renderProps.selectionMode === "none" || renderProps.isSelected
                ? "default"
                : "secondary",
          }),
          renderProps.allowsRemoving && "pr-1",
          className
        )
      )}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          {children}
          {renderProps.allowsRemoving && (
            <AriaButton
              slot="remove"
              className={cn(
                "rounded-sm opacity-70 ring-offset-background transition-opacity",
                /* Hover */
                "data-[hovered]:opacity-100",
                /* Resets */
                "focus-visible:outline-none",
                className
              )}
            >
              <XIcon aria-hidden className="size-3" />
            </AriaButton>
          )}
        </>
      ))}
    </AriaTag>
  )
}

interface JollyTagGroupProps<T>
  extends Omit<AriaTagGroupProps, "children">,
    Pick<AriaTagListProps<T>, "items" | "children" | "renderEmptyState"> {
  label?: string
  description?: string
  errorMessage?: string
}

function JollyTagGroup<T extends object>({
  label,
  description,
  className,
  errorMessage,
  items,
  children,
  renderEmptyState,
  ...props
}: JollyTagGroupProps<T>) {
  return (
    <TagGroup className={cn("group flex flex-col gap-2", className)} {...props}>
      <Label>{label}</Label>
      <TagList items={items} renderEmptyState={renderEmptyState}>
        {children}
      </TagList>
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      {errorMessage && (
        <Text className="text-sm text-destructive" slot="errorMessage">
          {errorMessage}
        </Text>
      )}
    </TagGroup>
  )
}

export { TagGroup, TagList, Tag, badgeVariants, JollyTagGroup }
export type { JollyTagGroupProps }