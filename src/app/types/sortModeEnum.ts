export enum SortModeEnum {
    DEFAULT,
    ALPHABETICAL,
    VALUE
}

export function sortModeEnumToString(enumValue: SortModeEnum): string {
    switch (enumValue) {
      case SortModeEnum.DEFAULT:
        return 'DEFAULT';
      case SortModeEnum.ALPHABETICAL:
        return 'ALPHABETICAL';
      case SortModeEnum.VALUE:
        return 'VALUE';
      default:
        return 'DEFAULT';
    }
}