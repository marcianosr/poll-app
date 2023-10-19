import React from "react";
import { useThemedElement } from "../../theming/useThemedElement";

export type TableProps<T> = {
    data: Iterable<T>;
    headers: React.ReactNode[];
    mapDataToRow: (
        data: T,
        rowIndex: number
    ) => { cells: React.ReactNode[]; detailRow?: React.ReactNode };
};

export const Table = <T,>({ ...props }: TableProps<T>) => {
    const ThemedFormField = useThemedElement("table");
    return <ThemedFormField {...props} />;
};
