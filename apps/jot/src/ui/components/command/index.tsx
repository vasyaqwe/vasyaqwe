import { Dialog as KobalteDialog } from "@kobalte/core"
import {
   createEventListener,
   mergeDefaultProps,
   mergeRefs,
} from "@kobalte/utils"
import { trackDeep } from "@solid-primitives/deep"
import { cn } from "@vasyaqwe/ui/utils"
import {
   type Accessor,
   type Component,
   type JSX,
   type ParentComponent,
   Show,
   createContext,
   createEffect,
   createMemo,
   createSignal,
   createUniqueId,
   on,
   onCleanup,
   onMount,
   splitProps,
   useContext,
} from "solid-js"
import { createStore } from "solid-js/store"
import { commandScore } from "./score"

type Children = { children?: JSX.Element }
type DivProps = JSX.IntrinsicElements["div"]

export type CommandLoadingProps = Children &
   DivProps & {
      /** Estimated progress of loading asynchronous options. */
      progress?: number
      /**
       * Accessible label for this loading progressbar. Not shown visibly.
       */
      label?: string
   }

export type CommandEmptyProps = Children & DivProps & {}
export type CommandSeparatorProps = DivProps & {
   /** Whether this separator should always be rendered. Useful if you disable automatic filtering. */
   alwaysRender?: boolean
}
// @ts-expect-error ...
export type CommandDialogProps = KobalteDialog.DialogRootProps &
   CommandRootProps & {
      /** Provide a className to the Dialog overlay. */
      overlayClassName?: string
      /** Provide a className to the Dialog content. */
      contentClassName?: string
      /** Provide a custom element the Dialog should portal into. */
      container?: HTMLElement
   }
export type CommandListProps = Children &
   DivProps & {
      /**
       * Accessible label for this List of suggestions. Not shown visibly.
       */
      label?: string
   }
export type CommandItemProps = Children &
   Omit<DivProps, "disabled" | "onSelect" | "value"> & {
      /** Whether this item is currently disabled. */
      disabled?: boolean
      /** Event handler for when this item is selected, either via click or keyboard selection. */
      onSelect?: (value: string) => void
      /**
       * A unique value for this item.
       * If no value is provided, it will be inferred from `children` or the rendered `textContent`. If your `textContent` changes between renders, you _must_ provide a stable, unique `value`.
       */
      value?: string
      /** Optional keywords to match against when filtering. */
      keywords?: string[]
      /** Whether this item is forcibly rendered regardless of filtering. */
      forceMount?: boolean
   }
export type CommandGroupProps = Children &
   Omit<DivProps, "heading" | "value"> & {
      /** Optional heading to render for this group. */
      heading?: JSX.Element
      /** If no heading is provided, you must provide a value that is unique for this group. */
      value?: string
      /** Whether this group is forcibly rendered regardless of filtering. */
      forceMount?: boolean
   }
export type CommandInputProps = Omit<
   JSX.IntrinsicElements["input"],
   "value" | "onChange" | "type"
> & {
   /**
    * Optional controlled state for the value of the search input.
    */
   value?: string
   /**
    * Event handler called when the search value changes.
    */
   onValueChange?: (search: string) => void
}
export type CommandRootProps = Children &
   DivProps & {
      /**
       * Accessible label for this command menu. Not shown visibly.
       */
      label?: string
      /**
       * Optionally set to `false` to turn off the automatic filtering and sorting.
       * If `false`, you must conditionally render valid items based on the search query yourself.
       */
      shouldFilter?: boolean
      /**
       * Custom filter function for whether each command menu item should matches the given search query.
       * It should return a number between 0 and 1, with 1 being the best match and 0 being hidden entirely.
       * By default, uses the `command-score` library.
       */
      filter?: (value: string, search: string, keywords?: string[]) => number
      /**
       * Optional default item value when it is initially rendered.
       */
      defaultValue?: string
      /**
       * Optional controlled state of the selected command menu item.
       */
      value?: string
      /**
       * Event handler called when the selected item of the menu changes.
       */
      onValueChange?: (value: string) => void
      /**
       * Optionally set to `true` to turn on looping around when using the arrow keys.
       */
      loop?: boolean
      /**
       * Optionally set to `true` to disable selection via pointer events.
       */
      disablePointerSelection?: boolean
      /**
       * Set to `false` to disable ctrl+n/j/p/k shortcuts. Defaults to `true`.
       */
      vimBindings?: boolean
      /**
       * Set to `true` to make keyboard navigation work without focusing the command first. Defaults to `false`.
       */
      main?: boolean
   }

type Context = {
   value: (id: string, value: string, keywords?: string[]) => void
   item: (id: string, groupId?: string) => void
   group: (id: string) => void
   filter: () => boolean
   label: Accessor<string>
   disablePointerSelection: Accessor<boolean>
   // Ids
   listId: string
   labelId: string
   inputId: string
   // Refs
   listInnerRef: Accessor<HTMLDivElement | null>
   setListInnerRef: (el: HTMLDivElement | null) => void
}

type State = {
   search: string
   value: string
   filtered: { count: number; items: Record<string, number>; groups: string[] }
   items: string[]
   groups: Record<string, string[]>
   ids: Record<string, { value: string; keywords?: string[] }>
}

type Store = {
   state: State
   snapshot: () => State
   setState: <K extends keyof State>(
      key: K,
      value: State[K],
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      opts?: any,
   ) => void
}

type Group = {
   id: string
   forceMount?: boolean
}

const GROUP_SELECTOR = `[cmdk-group=""]`
const GROUP_HEADING_SELECTOR = `[cmdk-group-heading=""]`
export const ITEM_SELECTOR = `[cmdk-item=""]`
const VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([aria-disabled="true"])`
const SELECT_EVENT = `cmdk-item-select`
const VALUE_ATTR = `data-value`
const defaultFilter: NonNullable<CommandRootProps["filter"]> = (
   value,
   search,
   keywords,
) => commandScore(value, search, keywords)

// @ts-ignore
const CommandContext = createContext<Context>(undefined)
const useCommand = () => useContext(CommandContext)
// @ts-ignore
const StoreContext = createContext<Store>(undefined)
const useStore = () => useContext(StoreContext)
// @ts-ignore
const GroupContext = createContext<Accessor<Group>>(undefined)

const Command: Component<CommandRootProps> = (props) => {
   const [state, setState] = createStore<State>({
      search: "",
      value: props.value ?? props.defaultValue ?? "",
      filtered: { count: 0, items: {}, groups: [] },
      items: [],
      groups: {},
      ids: {},
   })

   createEffect(() => {
      trackDeep(state.ids)
      const skipFiltering = !state.search || props.shouldFilter === false

      const items: Record<string, number> = state.items.reduce(
         (acc, id: string) => {
            acc[id] = skipFiltering
               ? 1
               : score(state.ids[id]?.value ?? "", state.ids[id]?.keywords)
            return acc
         },
         {} as Record<string, number>,
      )
      const groups = Object.keys(state.groups).filter((groupId) => {
         return state.groups[groupId]?.some(
            (id: string) => (items[id] || 0) > 0,
         )
      })
      const count = Object.values(items).filter((score) => score > 0).length
      setState("filtered", { count, items, groups })
   })

   const mergedProps = mergeDefaultProps(
      { vimBindings: true, disablePointerSelection: false, main: false },
      props,
   )

   const [localProps, etc] = splitProps(mergedProps, [
      "label",
      "children",
      "value",
      "onValueChange",
      "filter",
      "shouldFilter",
      "loop",
      "disablePointerSelection",
      "vimBindings",
   ])

   const listId = createUniqueId()
   const labelId = createUniqueId()
   const inputId = createUniqueId()

   const [listInnerRef, setListInnerRef] = createSignal<HTMLDivElement | null>(
      null,
   )

   const schedule = useScheduleLayoutEffect()

   /** Controlled mode `value` handling. */
   createEffect(() => {
      if (localProps.value !== undefined) {
         const v = localProps.value.trim()
         if (v !== state.value) {
            setState("value", v)
         }
      }
   })

   //TODO When getSelectedItem changes we should scroll it into view
   onMount(() => {
      schedule(6, scrollSelectedIntoView)
   })

   const store: Store = {
      state,
      snapshot: () => trackDeep(state),
      setState: (key, value, opts) => {
         if (Object.is(state[key], value)) return
         setState(key, value)

         if (key === "search") {
            //sort()
            schedule(8, selectFirstItem)
         } else if (key === "value") {
            // opts is a boolean referring to whether it should NOT be scrolled into view
            if (!opts) {
               // Scroll the selected item into view
               schedule(5, scrollSelectedIntoView)
            }
            if (props.value !== undefined) {
               // If controlled, just call the callback instead of updating state internally
               const newValue = (value ?? "") as string
               props.onValueChange?.(newValue)
               return
            }
         }
      },
   }

   const context: Context = {
      value: (id: string, value: string, keywords?: string[]) => {
         setState("ids", (ids) => ({
            ...ids,
            [id]: { value, keywords },
         }))

         //! Causes a re-render loop, I should investigate further
         //sort()
      },
      // Track item lifecycle (mount, unmount)
      item: (id: string, groupId?: string) => {
         if (!listInnerRef()) {
            console.warn("Mount Command.Item inside a Command.List component.")
         }
         setState((state) => {
            return {
               ...state,
               items: Array.from(new Set([...state.items, id])),
               ...(groupId && {
                  groups: {
                     ...state.groups,
                     [groupId]: [...(state.groups[groupId] || []), id],
                  },
               }),
            }
         })

         // Could be initial mount, select the first item if none already selected
         schedule(3, () => {
            //sort()

            if (!state.value) {
               selectFirstItem()
            }
         })

         onCleanup(() => {
            // @ts-expect-error ...
            setState((state) => ({
               ...state,
               items: state.items.filter((item) => item !== id),
               ...(groupId && {
                  groups: {
                     ...state.groups,
                     [groupId]: state.groups[groupId]?.filter(
                        (item) => item !== id,
                     ),
                  },
               }),
               ids: Object.fromEntries(
                  Object.entries(state.ids).filter(([key]) => key !== id),
               ),
            }))

            // Batch this, multiple items could be removed in one pass
            const selectedItem = getSelectedItem()
            if (selectedItem?.getAttribute("id") === id)
               schedule(1, () => selectFirstItem())
         })
      },
      // Track group lifecycle (mount, unmount)
      group: (id) => {
         if (!listInnerRef()) {
            console.warn("Mount Command.Group inside a Command.List component.")
         }
         setState("groups", (state) => {
            return {
               [id]: [],
               ...state,
            }
         })

         onCleanup(() => {
            setState((state) => ({
               ...state,
               groups: Object.fromEntries(
                  Object.entries(state.groups).filter(([key]) => key !== id),
               ),
               ids: Object.fromEntries(
                  Object.entries(state.ids).filter(([key]) => key !== id),
               ),
            }))
         })
      },
      filter: () => {
         return props.shouldFilter !== false
      },
      label: () => localProps.label || props["aria-label"] || "",
      disablePointerSelection: () => !!props.disablePointerSelection,
      listId,
      inputId,
      labelId,
      listInnerRef,
      setListInnerRef,
   }

   function score(value: string, keywords?: string[]) {
      const filter = localProps.filter ?? defaultFilter
      return value ? filter(value, state.search, keywords) : 0
   }

   function selectFirstItem() {
      if (props.value !== undefined) return
      const item = getValidItems().find(
         (item) => item.getAttribute("aria-disabled") !== "true",
      )
      const value = item?.getAttribute(VALUE_ATTR) || ""
      store.setState("value", value)
   }

   function scrollSelectedIntoView() {
      requestAnimationFrame(() => {
         const item = getSelectedItem()

         if (item) {
            if (item.parentElement?.firstChild === item) {
               // First item in Group, ensure heading is in view
               item
                  .closest(GROUP_SELECTOR)
                  ?.querySelector(GROUP_HEADING_SELECTOR)
                  ?.scrollIntoView({ block: "nearest" })
            }

            // Ensure the item is always in view
            item.scrollIntoView({ block: "nearest" })
         }
      })
   }

   function getSelectedItem() {
      return listInnerRef()?.querySelector(
         `${ITEM_SELECTOR}[aria-selected="true"]`,
      )
   }

   function getValidItems() {
      return Array.from(
         listInnerRef()?.querySelectorAll(VALID_ITEM_SELECTOR) || [],
      )
   }

   function updateSelectedToIndex(index: number) {
      const items = getValidItems()
      const item = items[index]
      if (item) store.setState("value", item.getAttribute(VALUE_ATTR) || "")
   }

   function updateSelectedByItem(change: 1 | -1) {
      const selected = getSelectedItem()
      const items = getValidItems()
      const index = items.findIndex((item) => item === selected)

      // Get item at this index
      let newSelected = items[index + change]

      if (props.loop) {
         newSelected =
            index + change < 0
               ? items[items.length - 1]
               : index + change === items.length
                 ? items[0]
                 : items[index + change]
      }

      if (newSelected)
         store.setState("value", newSelected.getAttribute(VALUE_ATTR) || "")
   }

   function updateSelectedByGroup(change: 1 | -1) {
      const selected = getSelectedItem()
      let group = selected?.closest(GROUP_SELECTOR)
      let item: HTMLElement | null = null

      while (group && !item) {
         group =
            change > 0
               ? findNextSibling(group, GROUP_SELECTOR)
               : findPreviousSibling(group, GROUP_SELECTOR)
         item = group?.querySelector(VALID_ITEM_SELECTOR) || null
      }

      if (item) {
         store.setState("value", item.getAttribute(VALUE_ATTR) || "")
      } else {
         updateSelectedByItem(change)
      }
   }

   const last = () => updateSelectedToIndex(getValidItems().length - 1)

   const next = (e: KeyboardEvent) => {
      e.preventDefault()

      if (e.metaKey) {
         // Last item
         last()
      } else if (e.altKey) {
         // Next group
         updateSelectedByGroup(1)
      } else {
         // Next item
         updateSelectedByItem(1)
      }
   }

   const prev = (e: KeyboardEvent) => {
      e.preventDefault()

      if (e.metaKey) {
         // First item
         updateSelectedToIndex(0)
      } else if (e.altKey) {
         // Previous group
         updateSelectedByGroup(-1)
      } else {
         // Previous item
         updateSelectedByItem(-1)
      }
   }

   const onKeyDown = (e: KeyboardEvent) => {
      // Handle vim keybinds for down
      if (
         (e.key === "n" || e.key === "j") &&
         localProps.vimBindings &&
         e.ctrlKey
      )
         return next(e)

      if (e.key === "ArrowDown") return next(e)

      // Handle vim keybinds for up
      if (
         (e.key === "p" || e.key === "k") &&
         localProps.vimBindings &&
         e.ctrlKey
      )
         return prev(e)

      if (e.key === "ArrowUp") return prev(e)

      if (e.key === "Home") {
         e.preventDefault()
         return updateSelectedToIndex(0)
      }

      if (e.key === "End") {
         e.preventDefault()
         return last()
      }

      if (e.key === "Enter") {
         // Skip if IME composition is not finished
         if (e.isComposing || e.keyCode === 229) return

         e.preventDefault()
         const item = getSelectedItem()
         if (!item) return

         const event = new Event(SELECT_EVENT)
         return item.dispatchEvent(event)
      }
   }

   createEventListener(document, "keydown", (e) => {
      if (
         !etc.main ||
         Array.from(document.querySelectorAll("dialog")).some(
            (dialog) => dialog.open,
         )
      )
         return
      onKeyDown(e)
   })

   return (
      <div
         tabIndex={-1}
         {...etc}
         cmdk-root=""
         onKeyDown={(e) => {
            //@ts-ignore
            etc.onKeyDown?.(e)
            if (e.defaultPrevented || etc.main) return
            onKeyDown(e)
         }}
      >
         <label
            cmdk-label=""
            for={context.inputId}
            id={context.labelId}
            // Screen reader only
            style={srOnlyStyles}
         >
            {localProps.label}
         </label>
         <StoreContext.Provider value={store}>
            <CommandContext.Provider value={context}>
               {props.children}
            </CommandContext.Provider>
         </StoreContext.Provider>
      </div>
   )
}

/**
 * Command menu item. Becomes active on pointer enter or through keyboard navigation.
 * Preferably pass a `value`, otherwise the value will be inferred from `children` or
 * the rendered item's `textContent`.
 */
const Item: ParentComponent<CommandItemProps> = (props) => {
   const store = useStore()
   const id = createUniqueId()
   const [ref, setRef] = createSignal<HTMLDivElement>()
   const groupContext = useContext(GroupContext)
   const context = useCommand()
   const [rendered, setRendered] = createSignal(false)

   onMount(() => {
      if (!forceMount()) return context?.item(id, groupContext?.().id)
   })

   //? Tracks the value of the item and updates it in context and on the [data-value] attribute
   const [value, setValue] = createSignal(props.value || "")

   createEffect(() => {
      if (props.value) {
         setValue(props.value)
         return
      }
      const innerValue = ref()?.textContent
      if (innerValue) {
         setValue(innerValue)
         return
      }
   })

   createEffect(() => {
      context?.value(id, value(), props.keywords)
      ref()?.setAttribute(VALUE_ATTR, value())
   })

   const forceMount = () => props.forceMount ?? groupContext?.().forceMount
   const selected = useCmdk((state) => value() && value() === state.value)

   const render = useCmdk((state) =>
      !rendered()
         ? true
         : forceMount()
           ? true
           : context?.filter() === false
             ? true
             : !state.search
               ? true
               : (state.filtered.items[id] || 0) > 0,
   )

   onMount(() => {
      const element = ref()
      if (!element || props.disabled) return
      setRendered(true)
   })

   createEffect(
      on(
         () => ({ ref: ref() }),
         ({ ref }) => {
            if (!ref) return
            ref.addEventListener(SELECT_EVENT, onSelect)

            onCleanup(() => {
               ref.removeEventListener(SELECT_EVENT, onSelect)
            })
         },
      ),
   )

   function onSelect() {
      select()
      props.onSelect?.(value())
   }

   function select() {
      store?.setState("value", value(), true)
   }

   const [localProps, etc] = splitProps(props, [
      "disabled",
      "onSelect",
      "value",
      "forceMount",
      "keywords",
   ])

   return (
      <Show when={render?.()}>
         {/* biome-ignore lint/a11y/useFocusableInteractive: <explanation> */}
         <div
            {...etc}
            ref={(el) => setRef(el)}
            id={id}
            cmdk-item=""
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="option"
            aria-disabled={Boolean(localProps.disabled)}
            aria-selected={Boolean(selected?.())}
            data-disabled={Boolean(localProps.disabled)}
            data-selected={selected?.() ? "" : undefined}
            onPointerMove={
               localProps.disabled || context?.disablePointerSelection()
                  ? undefined
                  : select
            }
            onClick={localProps.disabled ? undefined : onSelect}
         >
            {props.children}
         </div>
      </Show>
   )
}

/**
 * Group command menu items together with a heading.
 * Grouped items are always shown together.
 */
const Group: ParentComponent<CommandGroupProps> = (props) => {
   const [localProps, etc] = splitProps(props, [
      "heading",
      "value",
      "forceMount",
   ])
   const id = createUniqueId()
   const [ref, setRef] = createSignal<HTMLDivElement>()
   const [headerRef, setHeaderRef] = createSignal<HTMLDivElement>()
   const headingId = createUniqueId()
   const context = useCommand()
   const render = useCmdk((state) => {
      return localProps.forceMount
         ? true
         : context?.filter() === false
           ? true
           : !state.search
             ? true
             : state.filtered.groups.includes(id)
   })

   onMount(() => {
      context?.group(id)
   })

   const [value, setValue] = createSignal(props.value || "")

   createEffect(() => {
      if (props.value) {
         setValue(props.value)
         return
      }
      const innerValue = headerRef()?.textContent
      if (innerValue) {
         setValue(innerValue)
         return
      }
   })

   createEffect(() => {
      context?.value(id, value())
      ref()?.setAttribute(VALUE_ATTR, value())
   })

   const contextValue = () => ({ id, forceMount: localProps.forceMount })

   return (
      <div
         ref={mergeRefs((el) => setRef(el), props.ref)}
         {...etc}
         cmdk-group=""
         id={id}
         role="presentation"
         hidden={render?.() ? undefined : true}
      >
         <Show when={props.heading}>
            <div
               cmdk-group-heading=""
               ref={(el) => setHeaderRef(el)}
               aria-hidden
               id={headingId}
            >
               {props.heading}
            </div>
         </Show>

         <div
            cmdk-group-items=""
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="group"
            aria-labelledby={props.heading ? headingId : undefined}
         >
            <GroupContext.Provider value={contextValue}>
               {props.children}
            </GroupContext.Provider>
         </div>
      </div>
   )
}

/**
 * A visual and semantic separator between items or groups.
 * Visible when the search query is empty or `alwaysRender` is true, hidden otherwise.
 */
const Separator: Component<CommandSeparatorProps> = (props) => {
   const [localProps, etc] = splitProps(props, ["alwaysRender"])

   const render = useCmdk((state) => !state.search)

   return (
      <Show when={localProps.alwaysRender || render?.()}>
         {/* biome-ignore lint/a11y/useFocusableInteractive: <explanation> */}
         <div
            {...etc}
            cmdk-separator=""
            role="separator"
         />
      </Show>
   )
}

/**
 * Command menu input.
 * All props are forwarded to the underyling `input` element.
 */
const Input: Component<CommandInputProps> = (props) => {
   const [localProps, etc] = splitProps(props, ["onValueChange", "ref"])
   const isControlled = () => props.value != null
   const store = useStore()
   const search = useCmdk((state) => state.search)
   const value = useCmdk((state) => state.value)
   const context = useCommand()

   const selectedItemId = createMemo(() => {
      const item = context
         ?.listInnerRef()
         ?.querySelector(
            `${ITEM_SELECTOR}[${VALUE_ATTR}="${encodeURIComponent(value?.() ?? "")}"]`,
         )
      return item?.getAttribute("id") || undefined
   })

   createEffect(() => {
      if (props.value != null) {
         store?.setState("search", props.value)
      }
   })

   return (
      <input
         // ref={localProps.ref}
         {...etc}
         cmdk-input=""
         autocomplete="off"
         autocorrect="off"
         spellcheck={false}
         aria-autocomplete="list"
         role="combobox"
         aria-expanded={true}
         aria-controls={context?.listId}
         aria-labelledby={context?.labelId}
         aria-activedescendant={selectedItemId()}
         id={context?.inputId}
         type="text"
         value={isControlled() ? props.value : search?.()}
         onInput={(e) => {
            if (!isControlled()) {
               //@ts-ignore
               store.setState("search", e.target.value)
            }

            //@ts-ignore
            localProps.onValueChange?.(e.target.value)
         }}
      />
   )
}

/**
 * Contains `Item`, `Group`, and `Separator`.
 * Use the `--cmdk-list-height` CSS variable to animate height based on the number of results.
 */
const List: ParentComponent<CommandListProps> = (props) => {
   const mergedProps = mergeDefaultProps({ label: "Suggestions" }, props)
   const [localProps, etc] = splitProps(mergedProps, [
      "label",
      "children",
      "ref",
      "class",
   ])
   let ref: HTMLDivElement
   let height: HTMLDivElement | null

   const context = useCommand()

   onMount(() => {
      if (!ref || !height) return

      const el = height
      const wrapper = ref

      let animationFrame: number

      const observer = new ResizeObserver(() => {
         animationFrame = requestAnimationFrame(() => {
            const height = el.offsetHeight
            wrapper.style.setProperty(
               `--cmdk-list-height`,
               `${height.toFixed(1)}px`,
            )
         })
      })
      observer.observe(el)
      return () => {
         cancelAnimationFrame(animationFrame)
         observer.unobserve(el)
      }
   })

   return (
      // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
      <div
         // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
         ref={mergeRefs((el) => (ref = el), localProps.ref)}
         {...etc}
         cmdk-list=""
         // biome-ignore lint/a11y/useSemanticElements: <explanation>
         role="listbox"
         aria-label={localProps.label}
         id={context?.listId}
         class={cn("focus:outline-hidden", localProps.class)}
      >
         {SlottableWithNestedChildren(props, (child) => (
            <div
               // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
               ref={mergeRefs((el) => (height = el), context?.setListInnerRef)}
               cmdk-list-sizer=""
            >
               {child}
            </div>
         ))}
      </div>
   )
}

/**
 * Renders the command menu in a Kobalte Dialog.
 */
const Dialog: ParentComponent<CommandDialogProps> = (props) => {
   const [localProps, dialogRootProps, etc] = splitProps(
      props,
      ["overlayClassName", "contentClassName", "container"],
      [
         "open",
         "defaultOpen",
         "onOpenChange",
         "id",
         "modal",
         "preventScroll",
         "forceMount",
         "translations",
      ],
   )
   return (
      <KobalteDialog.Root {...dialogRootProps}>
         <KobalteDialog.Portal mount={localProps.container}>
            <KobalteDialog.Overlay
               cmdk-overlay=""
               class={localProps.overlayClassName}
            />
            <KobalteDialog.Content
               aria-label={props.label}
               cmdk-dialog=""
               class={localProps.contentClassName}
            >
               <Command {...etc} />
            </KobalteDialog.Content>
         </KobalteDialog.Portal>
      </KobalteDialog.Root>
   )
}

/**
 * Automatically renders when there are no results for the search query.
 */
const Empty: ParentComponent<CommandEmptyProps> = (props) => {
   const [mounted, setMounted] = createSignal(false)

   const render = useCmdk((state) => state.filtered.count === 0 && mounted())

   onMount(() => {
      setMounted(true)
   })
   return (
      <Show when={render?.()}>
         <div
            {...props}
            cmdk-empty=""
            role="presentation"
         />
      </Show>
   )
}

/**
 * You should conditionally render this with `progress` while loading asynchronous items.
 */
const Loading: ParentComponent<CommandLoadingProps> = (props) => {
   const mergedProps = mergeDefaultProps(
      {
         label: "Loading...",
      },
      props,
   )

   const [localProps, etc] = splitProps(mergedProps, [
      "progress",
      "children",
      "label",
   ])

   return (
      // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
      <div
         {...etc}
         cmdk-loading=""
         role="progressbar"
         aria-valuenow={localProps.progress}
         aria-valuemin={0}
         aria-valuemax={100}
         aria-label={localProps.label}
      >
         {SlottableWithNestedChildren(props, (child) => (
            <div aria-hidden>{child}</div>
         ))}
      </div>
   )
}

const pkg = Object.assign(Command, {
   List,
   Item,
   Input,
   Group,
   Separator,
   Dialog,
   Empty,
   Loading,
})

export { pkg as Command, defaultFilter, useCmdk as useCommandState }

export {
   Dialog as CommandDialog,
   Empty as CommandEmpty,
   Group as CommandGroup,
   Input as CommandInput,
   Item as CommandItem,
   List as CommandList,
   Loading as CommandLoading,
   Command as CommandRoot,
   Separator as CommandSeparator,
}

/**
 *
 *
 * Helpers
 *
 *
 */

function findNextSibling(el: Element, selector: string) {
   let sibling = el.nextElementSibling

   while (sibling) {
      if (sibling.matches(selector)) return sibling
      sibling = sibling.nextElementSibling
   }
}

function findPreviousSibling(el: Element, selector: string) {
   let sibling = el.previousElementSibling

   while (sibling) {
      if (sibling.matches(selector)) return sibling
      sibling = sibling.previousElementSibling
   }
}

/** Run a selector against the store state. */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function useCmdk<T = any>(selector: (state: State) => T) {
   const store = useStore()
   if (!store) return
   return () => selector(store.state)
}

/** Imperatively run a function on the next layout effect cycle. */
const useScheduleLayoutEffect = () => {
   const [s, ss] = createSignal(0)
   let fns = new Map<string | number, () => void>()

   createEffect(() => {
      s()
      queueMicrotask(() => {
         fns.forEach((f, _key) => {
            f()
         })
         fns = new Map()
      })
   })

   return (id: string | number, cb: () => void) => {
      fns.set(id, cb)
      ss(s() + 1)
   }
}

function SlottableWithNestedChildren(
   props: { asChild?: boolean; children?: JSX.Element },
   render: (child: JSX.Element) => JSX.Element,
) {
   //? Removed because I don't know what it does. Some kind of polymorphism
   /*if (props.asChild && React.isValidElement(children)) {
    return React.cloneElement(
      renderChildren(children),
      { ref: (children as any).ref },
      render(children.props.children),
    )
  }*/
   return render(props.children)
}

const srOnlyStyles = {
   position: "absolute",
   width: "1px",
   height: "1px",
   padding: "0",
   margin: "-1px",
   overflow: "hidden",
   clip: "rect(0, 0, 0, 0)",
   whiteSpace: "nowrap",
   borderWidth: "0",
} as const
