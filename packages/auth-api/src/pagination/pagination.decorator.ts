import { applyDecorators, UsePipes } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsMongoId,
    IsOptional,
    ValidateIf,
    IsEnum,
    IsNotEmpty,
    IsDate,
    IsString,
} from 'class-validator';
import { RequestAddDatePipe } from 'src/utils/request/pipe/request.add-date.pipe';
import { MinGreaterThan } from 'src/utils/request/validation/request.min-greater-than.validation';
import { Skip } from 'src/utils/request/validation/request.skip.validation';
import {
    ENUM_PAGINATION_AVAILABLE_SORT_TYPE,
    PAGINATION_DEFAULT_AVAILABLE_SORT,
    PAGINATION_DEFAULT_MAX_PAGE,
    PAGINATION_DEFAULT_MAX_PER_PAGE,
    PAGINATION_DEFAULT_PAGE,
    PAGINATION_DEFAULT_PER_PAGE,
    PAGINATION_DEFAULT_SORT,
} from './pagination.constant';
import {
    IPaginationFilterDateOptions,
    IPaginationFilterOptions,
    IPaginationFilterStringOptions,
} from './pagination.interface';

export function PaginationSearch(): any {
    return applyDecorators(
        Expose(),
        IsOptional(),
        IsString(),
        Transform(({ value }) => (value ? value : undefined))
    );
}

export function PaginationAvailableSearch(availableSearch: string[]): any {
    return applyDecorators(
        Expose(),
        Transform(() => availableSearch)
    );
}

export function PaginationPage(page = PAGINATION_DEFAULT_PAGE): any {
    return applyDecorators(
        Expose(),
        Type(() => Number),
        Transform(({ value }) =>
            !value
                ? page
                : value > PAGINATION_DEFAULT_MAX_PAGE
                ? PAGINATION_DEFAULT_MAX_PAGE
                : value
        )
    );
}

export function PaginationPerPage(perPage = PAGINATION_DEFAULT_PER_PAGE): any {
    return applyDecorators(
        Expose(),
        Type(() => Number),
        Transform(({ value }) =>
            !value
                ? perPage
                : value > PAGINATION_DEFAULT_MAX_PER_PAGE
                ? PAGINATION_DEFAULT_MAX_PER_PAGE
                : value
        )
    );
}

export function PaginationSort(
    sort = PAGINATION_DEFAULT_SORT,
    availableSort = PAGINATION_DEFAULT_AVAILABLE_SORT
): any {
    return applyDecorators(
        Expose(),
        Transform(({ value, obj }) => {
            const bSort = PAGINATION_DEFAULT_SORT.split('@')[0];

            const rSort = value || sort;
            const rAvailableSort = obj._availableSort || availableSort;
            const field: string = rSort.split('@')[0];
            const type: string = rSort.split('@')[1];
            const convertField: string = rAvailableSort.includes(field)
                ? field
                : bSort;
            const convertType: number =
                type === 'desc'
                    ? ENUM_PAGINATION_AVAILABLE_SORT_TYPE.DESC
                    : ENUM_PAGINATION_AVAILABLE_SORT_TYPE.ASC;

            return { [convertField]: convertType };
        })
    );
}

export function PaginationAvailableSort(
    availableSort = PAGINATION_DEFAULT_AVAILABLE_SORT
): any {
    return applyDecorators(
        Expose(),
        Transform(({ value }) => (!value ? availableSort : value))
    );
}

export function PaginationFilterBoolean(defaultValue: boolean[]): any {
    return applyDecorators(
        Expose(),
        IsBoolean({ each: true }),
        Transform(({ value }) =>
            value
                ? value
                      .split(',')
                      .map((val: string) => (val === 'true' ? true : false))
                : defaultValue
        )
    );
}

export function PaginationFilterEnum<T>(
    defaultValue: T[],
    defaultEnum: Record<string, any>
): any {
    const cEnum = defaultEnum as unknown;
    return applyDecorators(
        Expose(),
        IsEnum(cEnum as object, { each: true }),
        Transform(({ value }) =>
            value
                ? value.split(',').map((val: string) => defaultEnum[val])
                : defaultValue
        )
    );
}

export function PaginationFilterId(
    field: string,
    options?: IPaginationFilterOptions
): any {
    return applyDecorators(
        Expose(),
        IsMongoId(),
        options && options.required ? IsNotEmpty() : Skip(),
        options && options.required
            ? Skip()
            : ValidateIf((e) => e[field] !== '' && e[field])
    );
}

export function PaginationFilterDate(
    field: string,
    options?: IPaginationFilterDateOptions
): any {
    return applyDecorators(
        Expose(),
        IsDate(),
        Type(() => Date),
        options && options.required ? IsNotEmpty() : IsOptional(),
        options && options.required
            ? Skip()
            : options.asEndDate
            ? ValidateIf(
                  (e) =>
                      e[field] !== '' &&
                      e[options.asEndDate.moreThanField] !== '' &&
                      e[field] &&
                      e[options.asEndDate.moreThanField]
              )
            : ValidateIf((e) => e[field] !== '' && e[field]),
        options && options.asEndDate
            ? MinGreaterThan(options.asEndDate.moreThanField)
            : Skip(),
        options && options.asEndDate ? UsePipes(RequestAddDatePipe(1)) : Skip()
    );
}

export function PaginationFilterString(
    field: string,
    options?: IPaginationFilterStringOptions
) {
    return applyDecorators(
        Expose(),
        IsString(),
        options && options.lowercase
            ? Transform(({ value }) =>
                  value
                      ? value.split(',').map((val: string) => val.toLowerCase())
                      : undefined
              )
            : Skip(),
        options && options.required ? IsNotEmpty() : IsOptional(),
        options && options.required
            ? Skip()
            : ValidateIf((e) => e[field] !== '' && e[field])
    );
}
