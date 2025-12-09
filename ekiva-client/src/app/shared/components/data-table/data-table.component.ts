import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

export interface TableAction {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  callback: (row: any) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions?: TableAction[];
  @Input() loading = false;
  @Input() searchable = true;
  @Input() paginated = true;
  @Input() pageSize = 10;
  @Input() striped = true;
  @Input() hoverable = true;
  @Input() emptyMessage = 'Aucune donnée disponible';

  @Output() rowClicked = new EventEmitter<any>();
  @Output() sortChanged = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();

  searchTerm = '';
  currentPage = 1;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  filteredData: any[] = [];
  paginatedData: any[] = [];

  ngOnInit(): void {
    this.updateData();
  }

  ngOnChanges(): void {
    this.updateData();
  }

  updateData(): void {
    let result = [...this.data];

    // Search filter
    if (this.searchTerm && this.searchable) {
      result = result.filter(row =>
        this.columns.some(col =>
          String(row[col.key]).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }

    // Sorting
    if (this.sortColumn) {
      result.sort((a, b) => {
        const aVal = a[this.sortColumn!];
        const bVal = b[this.sortColumn!];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    this.filteredData = result;
    this.updatePagination();
  }

  updatePagination(): void {
    if (this.paginated) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    } else {
      this.paginatedData = this.filteredData;
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updateData();
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.updateData();
    this.sortChanged.emit({ column: column.key, direction: this.sortDirection });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getCellValue(row: any, column: TableColumn): string {
    const value = row[column.key];
    return column.format ? column.format(value) : value;
  }

  onRowClick(row: any): void {
    this.rowClicked.emit(row);
  }
}
