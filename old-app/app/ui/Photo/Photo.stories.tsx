import { Photo as PhotoComponent } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const url =
	"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/72f78d35-9fcc-43e8-a15e-0c89ad425b30/d9yo8rw-bedc63e5-f43f-4402-87d5-90bbb36a4e0d.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzcyZjc4ZDM1LTlmY2MtNDNlOC1hMTVlLTBjODlhZDQyNWIzMFwvZDl5bzhydy1iZWRjNjNlNS1mNDNmLTQ0MDItODdkNS05MGJiYjM2YTRlMGQuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.p4etM9M0lFc6U-RdSWUs2GGMOJ3CVA2UGaTS97fcZys";

const Story: ComponentMeta<typeof PhotoComponent> = {
	component: PhotoComponent,
	title: "Components/Photo",
	args: {},
	argTypes: {},
};

export default Story;

export const Photo: ComponentStory<typeof PhotoComponent> = (props) => (
	<PhotoComponent {...props} />
);

Photo.args = {
	photo: {
		url,
	},
	variant: "default",
	size: "medium",
};
