import { Fragment, useEffect, useState } from "react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import styles from "../../styles/channels.css";
import { Title } from "~/ui/Title";
import { links as commonStyleLinks } from "../polls/commonStyleLinks";
import { useAuth } from "~/providers/AuthProvider";

export function links() {
	return [...commonStyleLinks(), { rel: "stylesheet", href: styles }];
}
export const action: ActionFunction = async ({ request, params }) => {};

export const loader: LoaderFunction = async ({ request }) => {
	// console.log("sss", request);
	const cookie = request.headers.get("Cookie");
	console.log(request);

	// getAdminUser(googleUser?.email || "").then((result) => {
	//     return setAdmin(result);
	// });
	return {};
};

export default function AllChannels() {
	const { isAdmin, user } = useAuth();

	return (
		<section className="page-container">
			<Title size="xl" variant="primary">
				All channels
			</Title>
		</section>
	);
}
