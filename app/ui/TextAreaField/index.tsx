import classNames from "classnames";
import styles from "./styles.css";

type TextAreaProps = {
	id?: string;
	isValid?: boolean;
	placeholder: string;
	name: string;
	value: string;
	autoFocus?: boolean;
	disabled?: boolean;
	onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const TextAreaField = ({
	isValid,
	placeholder,
	name,
	id,
	value,
	autoFocus,
	disabled,
	onKeyDown,
	onChange,
}: TextAreaProps) => (
	<textarea
		id={id}
		placeholder={placeholder}
		name={name}
		defaultValue={value}
		autoFocus={autoFocus}
		disabled={disabled}
		onKeyDown={onKeyDown}
		onChange={onChange}
		className={classNames({
			"text-area-field-disabled": disabled,
			"text-area-field-valid": isValid,
		})}
	></textarea>
);
