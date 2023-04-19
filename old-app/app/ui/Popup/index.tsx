import React, { useState, useEffect } from "react";
import styles from "./styles.css";

type PopupProps = {
	isOpen: boolean;
	onClose?: () => void;
	children: React.ReactNode;
};

export const links = () => [{ rel: "stylesheet", href: styles }];

const Popup = ({ isOpen, onClose, children }: PopupProps) => {
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		setShowPopup(isOpen);
	}, [isOpen]);

	const handleCloseClick = () => {
		if (onClose) {
			onClose();
		}
		setShowPopup(false);
	};

	return (
		<>
			{showPopup && (
				<>
					<div onClick={handleCloseClick} className="overlay"></div>
					<dialog open className="popup">
						<div className="popup-content">
							{children}
							<button
								className="popup-close-button"
								onClick={handleCloseClick}
							>
								X
							</button>
						</div>
					</dialog>
				</>
			)}
		</>
	);
};

export default Popup;
