import { ChangeDetectionStrategy, Component, computed, input, output, signal, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  preview?: string;
  error?: string;
}

/**
 * A file upload component with drag & drop support.
 * 
 * ## Features
 * - Single/multiple file upload
 * - Drag & drop zone with visual feedback
 * - File type restrictions (accept attribute)
 * - File size validation
 * - Preview for images
 * - Progress indication during upload
 * - Error handling and validation
 * - Accessibility with ARIA live regions
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 * 
 * @example
 * ```html
 * <!-- Single file upload -->
 * <ui-file-upload
 *   accept="image/*"
 *   [maxSize]="5242880"
 *   (filesSelected)="handleFiles($event)">
 * </ui-file-upload>
 * 
 * <!-- Multiple file upload with preview -->
 * <ui-file-upload
 *   [multiple]="true"
 *   [showPreview]="true"
 *   accept=".pdf,.doc,.docx"
 *   (filesSelected)="handleFiles($event)"
 *   (fileRemoved)="handleRemove($event)">
 * </ui-file-upload>
 * 
 * <!-- With custom upload function -->
 * <ui-file-upload
 *   [multiple]="true"
 *   [uploadFn]="customUploadFn"
 *   (uploadComplete)="handleComplete($event)">
 * </ui-file-upload>
 * ```
 */
@Component({
  selector: 'ui-file-upload',
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      <!-- Hidden file input -->
      <input
        #fileInput
        type="file"
        [accept]="accept()"
        [multiple]="multiple()"
        [disabled]="disabled()"
        (change)="onFileInputChange($event)"
        class="hidden"
        [attr.aria-label]="ariaLabel() || 'File upload input'"
      />

      <!-- Drop zone -->
      <div
        [class]="dropZoneClasses()"
        (click)="openFileDialog()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        [attr.role]="'button'"
        [attr.tabindex]="disabled() ? -1 : 0"
        [attr.aria-label]="'Click or drag files to upload'"
        (keydown.enter)="openFileDialog()"
        (keydown.space)="openFileDialog()">
        
        <div class="flex flex-col items-center gap-3">
          <!-- Upload icon -->
          <div [class]="iconClasses()">
            @if (isDragging()) {
              <span class="text-4xl">📥</span>
            } @else {
              <span class="text-4xl">📁</span>
            }
          </div>

          <!-- Instructions -->
          <div class="text-center">
            <p [class]="instructionClasses()">
              @if (isDragging()) {
                Drop files here
              } @else {
                {{ dropZoneText() || 'Drag & drop files here or click to browse' }}
              }
            </p>
            @if (accept() && !isDragging()) {
              <p [class]="hintClasses()">
                Accepted: {{ accept() }}
              </p>
            }
            @if (maxSize() && !isDragging()) {
              <p [class]="hintClasses()">
                Max size: {{ formatFileSize(maxSize()!) }}
              </p>
            }
          </div>
        </div>
      </div>

      <!-- File list -->
      @if (uploadedFiles().length > 0) {
        <div 
          class="mt-4 space-y-2"
          role="list"
          [attr.aria-label]="'Uploaded files'">
          @for (file of uploadedFiles(); track file.id) {
            <div 
              [class]="fileItemClasses()"
              role="listitem">
              
              <!-- Preview or icon -->
              <div class="flex-shrink-0">
                @if (showPreview() && file.preview) {
                  <img 
                    [src]="file.preview" 
                    [alt]="file.name"
                    class="w-12 h-12 object-cover rounded"
                  />
                } @else {
                  <div class="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                    <span class="text-2xl">{{ getFileIcon(file.type) }}</span>
                  </div>
                }
              </div>

              <!-- File info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ file.name }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ formatFileSize(file.size) }}
                </p>

                <!-- Progress bar -->
                @if (file.status === 'uploading') {
                  <div class="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      class="bg-blue-600 h-1.5 rounded-full transition-all"
                      [style.width.%]="file.progress"
                      role="progressbar"
                      [attr.aria-valuenow]="file.progress"
                      [attr.aria-valuemin]="0"
                      [attr.aria-valuemax]="100">
                    </div>
                  </div>
                }

                <!-- Error message -->
                @if (file.status === 'error' && file.error) {
                  <p class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                    {{ file.error }}
                  </p>
                }
              </div>

              <!-- Status icon -->
              <div class="flex-shrink-0">
                @if (file.status === 'success') {
                  <span class="text-green-600 dark:text-green-400 text-xl">✓</span>
                } @else if (file.status === 'error') {
                  <span class="text-red-600 dark:text-red-400 text-xl">⚠</span>
                } @else if (file.status === 'uploading') {
                  <span class="text-blue-600 dark:text-blue-400 text-xl animate-spin">⟳</span>
                }
              </div>

              <!-- Remove button -->
              @if (!disabled() && file.status !== 'uploading') {
                <button
                  type="button"
                  (click)="removeFile(file.id)"
                  class="flex-shrink-0 p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [attr.aria-label]="'Remove ' + file.name">
                  <span class="text-xl">✕</span>
                </button>
              }
            </div>
          }
        </div>
      }

      <!-- Live region for screen readers -->
      <div 
        class="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true">
        {{ ariaLiveMessage() }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-file-upload block'
  }
})
export class FileUploadComponent {
  private fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  /**
   * Accepted file types (e.g., "image/*", ".pdf,.doc").
   * @default undefined
   */
  accept = input<string>();

  /**
   * Allow multiple file selection.
   * @default false
   */
  multiple = input<boolean>(false);

  /**
   * Maximum file size in bytes.
   * @default undefined
   */
  maxSize = input<number>();

  /**
   * Whether to show image previews.
   * @default true
   */
  showPreview = input<boolean>(true);

  /**
   * Whether the component is disabled.
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Custom text for the drop zone.
   * @default undefined
   */
  dropZoneText = input<string>();

  /**
   * ARIA label for the component.
   * @default undefined
   */
  ariaLabel = input<string>();

  /**
   * Custom upload function.
   * @default undefined
   */
  uploadFn = input<(file: File) => Promise<void>>();

  /**
   * Emitted when files are selected.
   * @event filesSelected
   */
  filesSelected = output<File[]>();

  /**
   * Emitted when a file is removed.
   * @event fileRemoved
   */
  fileRemoved = output<string>();

  /**
   * Emitted when upload is complete.
   * @event uploadComplete
   */
  uploadComplete = output<UploadedFile[]>();

  /**
   * Emitted when an upload error occurs.
   * @event uploadError
   */
  uploadError = output<{ fileId: string; error: string }>();

  // Internal state
  isDragging = signal(false);
  uploadedFiles = signal<UploadedFile[]>([]);
  ariaLiveMessage = signal('');

  containerClasses = computed(() => 'w-full');

  dropZoneClasses = computed(() => {
    const base = 'border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer';
    const state = {
      default: 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400',
      dragging: 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20',
      disabled: 'opacity-50 cursor-not-allowed'
    };

    if (this.disabled()) {
      return `${base} ${state.disabled}`;
    }
    if (this.isDragging()) {
      return `${base} ${state.dragging}`;
    }
    return `${base} ${state.default}`;
  });

  iconClasses = computed(() => 'transition-transform duration-200');

  instructionClasses = computed(() => 'text-base font-medium text-gray-900 dark:text-gray-100');

  hintClasses = computed(() => 'text-sm text-gray-600 dark:text-gray-400 mt-1');

  fileItemClasses = computed(() => 
    'flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'
  );

  openFileDialog() {
    if (this.disabled()) return;
    this.fileInputRef()?.nativeElement.click();
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
      input.value = ''; // Reset input
    }
  }

  onDragOver(event: DragEvent) {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  handleFiles(files: File[]) {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // Validate file size
      if (this.maxSize() && file.size > this.maxSize()!) {
        errors.push(`${file.name}: File too large (max ${this.formatFileSize(this.maxSize()!)})`);
        continue;
      }

      // Validate file type
      if (this.accept()) {
        const acceptedTypes = this.accept()!.split(',').map(t => t.trim());
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', ''));
          }
          return file.type === type;
        });

        if (!isAccepted) {
          errors.push(`${file.name}: File type not accepted`);
          continue;
        }
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      this.addFiles(validFiles);
      this.filesSelected.emit(validFiles);
      this.ariaLiveMessage.set(`${validFiles.length} file(s) selected`);
    }

    if (errors.length > 0) {
      this.ariaLiveMessage.set(`Errors: ${errors.join(', ')}`);
    }
  }

  addFiles(files: File[]) {
    const newFiles: UploadedFile[] = files.map(file => ({
      file,
      id: this.generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending' as const
    }));

    // Generate preview for images
    newFiles.forEach(uploadFile => {
      if (this.showPreview() && uploadFile.file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadFile.preview = e.target?.result as string;
          this.uploadedFiles.update(files => [...files]);
        };
        reader.readAsDataURL(uploadFile.file);
      }
    });

    this.uploadedFiles.update(files => [...files, ...newFiles]);

    // Auto-upload if uploadFn is provided
    if (this.uploadFn()) {
      newFiles.forEach(file => this.uploadFile(file));
    }
  }

  async uploadFile(uploadedFile: UploadedFile) {
    uploadedFile.status = 'uploading';
    this.uploadedFiles.update(files => [...files]);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        uploadedFile.progress = Math.min(uploadedFile.progress + 10, 90);
        this.uploadedFiles.update(files => [...files]);
      }, 200);

      await this.uploadFn()!(uploadedFile.file);

      clearInterval(progressInterval);
      uploadedFile.progress = 100;
      uploadedFile.status = 'success';
      this.uploadedFiles.update(files => [...files]);
      this.ariaLiveMessage.set(`${uploadedFile.name} uploaded successfully`);
    } catch (error) {
      uploadedFile.status = 'error';
      uploadedFile.error = error instanceof Error ? error.message : 'Upload failed';
      this.uploadedFiles.update(files => [...files]);
      this.uploadError.emit({ fileId: uploadedFile.id, error: uploadedFile.error });
      this.ariaLiveMessage.set(`Error uploading ${uploadedFile.name}`);
    }
  }

  removeFile(fileId: string) {
    this.uploadedFiles.update(files => files.filter(f => f.id !== fileId));
    this.fileRemoved.emit(fileId);
    this.ariaLiveMessage.set('File removed');
  }

  getFileIcon(type: string): string {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📽️';
    if (type.includes('zip') || type.includes('archive')) return '📦';
    return '📄';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  private generateId(): string {
    return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
