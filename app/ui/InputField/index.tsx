import classNames from "classnames";
import styles from "./styles.css";

type InputFieldProps = {
	type: "range" | "text" | string; // refactor to input types
	placeholder: string;
	name: string;
	value: string | number;
	disabled?: boolean;
	isValid?: boolean;
	min?: number;
	max?: number;
	id?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const InputField = ({
	type,
	placeholder,
	name,
	value,
	disabled,
	isValid,
	min,
	max,
	id,
	onChange,
}: InputFieldProps) => (
	<input
		{...(typeof value === "number" && { min, max })}
		onChange={onChange}
		type={type}
		placeholder={placeholder}
		id={id}
		name={name}
		defaultValue={value}
		disabled={disabled}
		className={classNames("input-field-default", {
			"input-field-disabled": disabled,
			"input-field-valid": isValid,
		})}
	/>
);
