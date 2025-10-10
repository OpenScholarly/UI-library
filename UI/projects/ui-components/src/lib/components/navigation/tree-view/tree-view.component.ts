import { Component, input, output, computed, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { TreeNode } from '../../../types';

/**
 * A versatile tree view component for displaying hierarchical data.
 *
 * ## Features
 * - Hierarchical tree structure with unlimited nesting
 * - Expand/collapse functionality with keyboard support
 * - Single or multi-select modes
 * - Custom icons for nodes
 * - Keyboard navigation (Arrow keys, Enter, Space)
 * - Selection indicators and active states
 * - Disabled node support
 * - Empty state display
 * - WCAG 2.1 Level AA accessibility with proper ARIA
 * - Dark mode support
 *
 * @example
 * ```html
 * <!-- File system tree -->
 * <ui-tree-view
 *   [nodes]="fileTree"
 *   [selectable]="true"
 *   (nodeClick)="openFile($event)"
 *   (nodeSelect)="selectFile($event)">
 * </ui-tree-view>
 *
 * <!-- Multi-select tree -->
 * <ui-tree-view
 *   [nodes]="categories"
 *   [selectable]="true"
 *   [multiSelect]="true"
 *   (nodeSelect)="onCategorySelect($event)">
 * </ui-tree-view>
 *
 * <!-- Organization hierarchy -->
 * <ui-tree-view
 *   [nodes]="orgStructure"
 *   (nodeToggle)="onNodeToggle($event)"
 *   (nodeClick)="viewDetails($event)">
 * </ui-tree-view>
 * ```
 */
@Component({
  selector: 'ui-tree-view',
  template: `
    <div [class]="containerClasses()">
      @if (nodes().length > 0) {
        <ul class="space-y-1" role="tree">
          @for (node of nodes(); track node.id) {
            <li [attr.role]="'treeitem'" [attr.aria-expanded]="hasChildren(node) ? isExpanded(node.id) : null">
              <div 
                [class]="nodeClasses()(node)"
                [style.padding-left]="(level() * 20) + 'px'"
                (click)="handleNodeClick(node)"
                (keydown)="onKeyDown($event, node)"
                [attr.tabindex]="node.disabled ? -1 : 0"
              >
                <!-- Expand/collapse button -->
                @if (hasChildren(node)) {
                  <button
                    type="button"
                    class="flex-shrink-0 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    (click)="toggleNode(node.id); $event.stopPropagation()"
                    [attr.aria-label]="isExpanded(node.id) ? 'Collapse' : 'Expand'"
                  >
                    <svg
                      class="w-4 h-4 text-gray-400 transform transition-transform"
                      [class.rotate-90]="isExpanded(node.id)"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L9.586 11 7.293 8.707a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                } @else {
                  <div class="w-6 h-6"></div>
                }
                
                <!-- Node icon: dynamic for folders, optional custom for leaf, default file icon -->
                @if (hasChildren(node)) {
                  <span class="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-600">
                    {{ getFolderIcon(node.id) }}
                  </span>
                } @else if (node.icon) {
                  <span class="flex-shrink-0 mr-2 text-lg">{{ node.icon }}</span>
                } @else {
                  <span class="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-600">📄</span>
                }
                
                <!-- Node label -->
                <span [class]="labelClasses()(node)" class="flex-1 truncate">
                  {{ node.label }}
                </span>
                
                <!-- Selection indicator -->
                @if (node.selected) {
                  <span class="flex-shrink-0 ml-2 text-blue-500 dark:text-blue-400">✓</span>
                }
              </div>
              
              <!-- Children -->
              @if (hasChildren(node) && isExpanded(node.id)) {
                <ui-tree-view
                  [nodes]="node.children!"
                  [level]="level() + 1"
                  [selectable]="selectable()"
                  [multiSelect]="multiSelect()"
                  (nodeClick)="nodeClick.emit($event)"
                  (nodeToggle)="nodeToggle.emit($event)"
                  (nodeSelect)="nodeSelect.emit($event)"
                  (clearSelections)="onClearSelections()"
                ></ui-tree-view>
              }
            </li>
          }
        </ul>
      } @else {
        <div class="text-center py-8">
          <div class="text-4xl mb-2">🌳</div>
          <div class="text-gray-500 dark:text-gray-400 text-sm">
            No items to display
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ui-tree-view block'
  }
})
export class TreeViewComponent {
  nodes = input<TreeNode[]>([]);
  level = input<number>(0);
  selectable = input<boolean>(false);
  multiSelect = input<boolean>(false);
  
  nodeClick = output<TreeNode>();
  nodeToggle = output<{ node: TreeNode; expanded: boolean }>();
  nodeSelect = output<{ node: TreeNode; selected: boolean }>();
  clearSelections = output<void>();
  
  expandedNodes = signal<Set<string>>(new Set());

  constructor() {
    // Initialize expanded nodes based on node.expanded property
    effect(() => {
      const nodes = this.nodes();
      if (nodes.length > 0) {
        const initiallyExpanded = new Set<string>();
        this.collectExpandedNodes(nodes, initiallyExpanded);
        this.expandedNodes.set(initiallyExpanded);
      }
    });

    // Enforce single selection when multiSelect is false
    effect(() => {
      if (!this.selectable() || this.multiSelect()) return;
      const nodes = this.nodes();
      if (nodes.length === 0) return;

      let found = false;
      const walk = (arr: TreeNode[]) => {
        for (const n of arr) {
          if (n.selected) {
            if (!found) {
              found = true;
            } else {
              n.selected = false;
            }
          }
          if (n.children) walk(n.children);
        }
      };
      walk(nodes);
    });
  }

  containerClasses = computed(() => {
    return 'ui-tree-view select-none';
  });

  nodeClasses = computed(() => (node: TreeNode) => {
    const baseClasses = 'flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400';
    
    if (node.disabled) {
      return `${baseClasses} text-gray-400 dark:text-gray-600 cursor-not-allowed`;
    }
    
    if (node.selected && this.selectable()) {
      return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100`;
    }
    
    return `${baseClasses} hover:bg-gray-100 dark:hover:bg-gray-700`;
  });

  labelClasses = computed(() => (node: TreeNode) => {
    const baseClasses = 'text-sm';
    
    if (node.disabled) {
      return `${baseClasses} text-gray-400 dark:text-gray-600`;
    }
    
    return `${baseClasses} font-medium text-gray-900 dark:text-white`;
  });

  chevronClasses = computed(() => {
    // Access the signal to make this reactive
    const expanded = this.expandedNodes();
    return (nodeId: string) => {
      const baseClasses = 'text-sm transform transition-transform';
      
      if (expanded.has(nodeId)) {
        return `${baseClasses} rotate-90`;
      }
      
      return baseClasses;
    };
  });

  folderIcon = computed(() => {
    // Access the signal to make this reactive
    const expanded = this.expandedNodes();
    return (nodeId: string) => {
      return expanded.has(nodeId) ? '📂' : '📁';
    };
  });

  getChevronClasses(nodeId: string): string {
    const baseClasses = 'text-sm transform transition-transform';
    
    if (this.isExpanded(nodeId)) {
      return `${baseClasses} rotate-90`;
    }
    
    return baseClasses;
  }

  getFolderIcon(nodeId: string): string {
    return this.isExpanded(nodeId) ? '📂' : '📁';
  }

  hasChildren(node: TreeNode): boolean {
    return !!(node.children && node.children.length > 0);
  }

  isExpanded(nodeId: string): boolean {
    return this.expandedNodes().has(nodeId);
  }

  toggleNode(nodeId: string) {
    const node = this.findNodeById(nodeId);
    if (!node || !this.hasChildren(node)) return;

    const wasExpanded = this.isExpanded(nodeId);
    
    this.expandedNodes.update(expanded => {
      const newExpanded = new Set(expanded);
      if (wasExpanded) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return newExpanded;
    });

    this.nodeToggle.emit({ 
      node, 
      expanded: !wasExpanded 
    });
  }

  handleNodeClick(node: TreeNode) {
    if (node.disabled) return;

    // Handle selection
    if (this.selectable()) {
      if (this.multiSelect()) {
        // Multi-select mode - prevent parent/child selection conflicts
        if (node.selected) {
          // Deselecting - just deselect this node
          node.selected = false;
        } else {
          // Selecting - deselect any conflicting nodes
          this.clearConflictingSelections(node);
          node.selected = true;
        }
      } else {
        // Single-select mode - emit clear event to coordinate with parent/children
        if (this.level() === 0) {
          // Root level - clear all selections in this tree
          this.clearAllSelections();
        } else {
          // Child level - emit to parent to clear all selections
          this.clearSelections.emit();
        }
        node.selected = true;
      }
      this.nodeSelect.emit({ node, selected: node.selected ?? false });
    }

    // Expand/collapse if it has children
    if (this.hasChildren(node)) {
      this.toggleNode(node.id);
    }

    this.nodeClick.emit(node);
  }

  onClearSelections() {
    // Handle clear selections event from child components
    this.clearAllSelections();
    if (this.level() > 0) {
      // Propagate to parent
      this.clearSelections.emit();
    }
  }

  onKeyDown(event: KeyboardEvent, node: TreeNode) {
    if (node.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.handleNodeClick(node);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (this.hasChildren(node) && !this.isExpanded(node.id)) {
          this.toggleNode(node.id);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (this.hasChildren(node) && this.isExpanded(node.id)) {
          this.toggleNode(node.id);
        }
        break;
    }
  }

  private findNodeById(nodeId: string): TreeNode | null {
    const findInNodes = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        if (node.children) {
          const found = findInNodes(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInNodes(this.nodes());
  }

  private collectExpandedNodes(nodes: TreeNode[], expandedSet: Set<string>) {
    for (const node of nodes) {
      if (node.expanded) {
        expandedSet.add(node.id);
      }
      if (node.children) {
        this.collectExpandedNodes(node.children, expandedSet);
      }
    }
  }

  private clearAllSelections() {
    const clearInNodes = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.selected) {
          node.selected = false;
        }
        if (node.children) {
          clearInNodes(node.children);
        }
      });
    };
    clearInNodes(this.nodes());
  }

  private clearConflictingSelections(selectedNode: TreeNode) {
    // When selecting a node, deselect any ancestors and descendants
    // to avoid parent/child selection conflicts
    
    // 1. Deselect all ancestors
    this.deselectAncestors(selectedNode);
    
    // 2. Deselect all descendants
    this.deselectDescendants(selectedNode);
  }

  private deselectAncestors(node: TreeNode) {
    // Find and deselect all parent nodes
    const findAndDeselectParent = (nodes: TreeNode[], targetId: string): boolean => {
      for (const n of nodes) {
        if (n.children) {
          // Check if any child matches our target
          if (this.hasDescendant(n.children, targetId)) {
            n.selected = false; // Deselect this parent
            return true;
          }
          // Recursively check deeper
          if (findAndDeselectParent(n.children, targetId)) {
            n.selected = false; // Deselect this ancestor
            return true;
          }
        }
      }
      return false;
    };
    
    findAndDeselectParent(this.nodes(), node.id);
  }

  private deselectDescendants(node: TreeNode) {
    // Deselect all child nodes
    if (node.children) {
      const clearInNodes = (nodes: TreeNode[]) => {
        nodes.forEach(child => {
          child.selected = false;
          if (child.children) {
            clearInNodes(child.children);
          }
        });
      };
      clearInNodes(node.children);
    }
  }

  private hasDescendant(nodes: TreeNode[], targetId: string): boolean {
    for (const node of nodes) {
      if (node.id === targetId) {
        return true;
      }
      if (node.children && this.hasDescendant(node.children, targetId)) {
        return true;
      }
    }
    return false;
  }
}