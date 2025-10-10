import { Component, input, output, computed, signal } from '@angular/core';
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
                [class]="nodeClasses(node)"
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
                    <span class="text-sm transform transition-transform" 
                          [class.rotate-90]="isExpanded(node.id)">
                      ▶
                    </span>
                  </button>
                } @else {
                  <div class="w-6 h-6"></div>
                }
                
                <!-- Node icon -->
                @if (node.icon) {
                  <span class="flex-shrink-0 mr-2 text-lg">{{ node.icon }}</span>
                } @else if (!hasChildren(node)) {
                  <span class="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-600">📄</span>
                } @else {
                  <span class="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-600">
                    {{ isExpanded(node.id) ? '📂' : '📁' }}
                  </span>
                }
                
                <!-- Node label -->
                <span [class]="labelClasses(node)" class="flex-1 truncate">
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
  
  expandedNodes = signal<Set<string>>(new Set());

  containerClasses = computed(() => [
    'ui-tree-view',
    {
      'select-none': true
    }
  ]);

  nodeClasses = (node: TreeNode) => [
    'flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer transition-colors',
    {
      'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100': node.selected && this.selectable(),
      'hover:bg-gray-100 dark:hover:bg-gray-700': !node.disabled && !node.selected,
      'text-gray-400 dark:text-gray-600 cursor-not-allowed': node.disabled,
      'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400': !node.disabled
    }
  ];

  labelClasses = (node: TreeNode) => [
    'text-sm',
    {
      'font-medium text-gray-900 dark:text-white': !node.disabled,
      'text-gray-400 dark:text-gray-600': node.disabled
    }
  ];

  hasChildren(node: TreeNode): boolean {
    return !!(node.children && node.children.length > 0);
  }

  isExpanded(nodeId: string): boolean {
    const expanded = this.expandedNodes().has(nodeId);
    // Also check the node's own expanded property for initial state
    const node = this.findNodeById(nodeId);
    return expanded || (node?.expanded ?? false);
  }

  toggleNode(nodeId: string) {
    const node = this.findNodeById(nodeId);
    if (!node || !this.hasChildren(node)) return;

    this.expandedNodes.update(expanded => {
      const newExpanded = new Set(expanded);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return newExpanded;
    });

    if (node) {
      this.nodeToggle.emit({ 
        node, 
        expanded: this.isExpanded(nodeId) 
      });
    }
  }

  handleNodeClick(node: TreeNode) {
    if (node.disabled) return;

    // Handle selection
    if (this.selectable()) {
      if (this.multiSelect()) {
        // Multi-select mode
        node.selected = !node.selected;
      } else {
        // Single-select mode
        this.clearAllSelections();
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

  private clearAllSelections() {
    const clearInNodes = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        node.selected = false;
        if (node.children) {
          clearInNodes(node.children);
        }
      });
    };
    clearInNodes(this.nodes());
  }
}