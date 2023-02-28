import classNames from "classnames";
import styles from "./styles.css";

type InputFieldProps = {
	type: string;
	placeholder: string;
	name: string;
	value: string;
	disabled?: boolean;
	isValid?: boolean;
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
}: InputFieldProps) => (
	<input
		type={type}
		placeholder={placeholder}
		name={name}
		defaultValue={value}
		disabled={disabled}
		className={classNames({
			"input-field-disabled": disabled,
			"input-field-valid": isValid,
		})}
	/>
);
