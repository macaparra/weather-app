import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate'
})
export class PaginationPipe implements PipeTransform {
  transform(array: any[], currentPage: number, pageSize: number): any[] {
    if (!array || array.length === 0) {
      return [];
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;

    return array.slice(startIndex, endIndex);
  }
}
