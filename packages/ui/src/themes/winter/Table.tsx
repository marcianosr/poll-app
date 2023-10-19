import React from "react";
import { TableProps } from "../../components/Table";
import styles from "./Table.module.css";

export const Table = <T,>({ data, headers, mapDataToRow }: TableProps<T>) => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {headers.map((h, i) =>
                        h === null ? <td key={i}></td> : <th key={i}>{h}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {Array.from(data).map((dataRow, i) => {
                    const rowData = mapDataToRow(dataRow, i);
                    return (
                        <React.Fragment key={i}>
                            <tr>
                                {rowData.cells.map((cell, idx) => (
                                    <td key={idx}>{cell}</td>
                                ))}
                            </tr>
                            {rowData.detailRow && (
                                <tr>
                                    <td colSpan={rowData.cells.length}>
                                        {rowData.detailRow}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
};
