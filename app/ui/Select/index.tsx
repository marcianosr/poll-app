import styles from "./styles.css";

type SelectProps = {
	name: string;
	value: string;
	options: string[];
	// optionValue: "checkbox" | "radio";
};

type OptionProps = {
	text: string;
	value: string;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Select = ({ name, value, options }: SelectProps) => (
	<select name={name} defaultValue={value}>
		{options.map((option) => (
			<Option value={value} text={option} />
		))}
	</select>
);

const Option = ({ value, text }: OptionProps) => (
	<option value={value}>{text}</option>
);
