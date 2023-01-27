import { PropsWithChildren } from "react";
import styles from "./styles.css";

export type OptionsProps = {};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Options = ({ children }: PropsWithChildren<OptionsProps>) => {
	return <section className="options">{children}</section>;
};
