"use client"; 

import { createPitch } from "@/lib/actions";

import { useState, useActionState } from "react";
import dynamic from "next/dynamic";

// 4) Dynamically import the MD editor so it doesn't run on the server (avoids hydration issues)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// 5) UI controls (shadcn/ui)
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import Send from "@/app/components/icons/sendIcon";

// importing from validation
import { formSchema } from "@/lib/validation";
import { z } from "zod";

// 7) Toasts (notification ui library) & router (for redirect after successful form submit)
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

// 8) Strong types (typescript) for form values and action state
type FormValues = z.infer<typeof formSchema>;
type ActionState =
  | { status: "INITIAL"; error: "" }
  | { status: "ERROR"; error: string }
  | { status: "OK"; error: "" };

// Optional (typescript): type for field error map (key = field name, value = string[] of messages)
type FieldErrors = Partial<Record<keyof FormValues, string[]>>;

export default function StartupForm() {
  // 11) Local state (errors + pitch). Default to empty string to keep textarea controlled.
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pitch, setPitch] = useState<string>("");

  const router = useRouter(); // 12) programmatic navigation

  // 13) Form action handler used by useActionState. Receives prevState + FormData.
  const handleFormSubmit = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const values: FormValues = {
      title: (formData.get("title") || "") as string,
      description: (formData.get("description") || "") as string,
      category: (formData.get("category") || "") as string,
      image: (formData.get("image") || "") as string,
      pitch,
    };

    // ✅ Throws on error, so console.log only runs if valid
    await formSchema.parseAsync(values);

    console.log(values); // Only reached if valid
    
    const result = await createPitch(prevState, formData, pitch)
    console.log(result)
    if(result.status == "success"){
      toast.success("Form submitted successfully ✅", {description: "Congratulations. Your form has been submitted successfully. CHeck it out"});
      // reroute to page when done
      router.push(`/startup/${result._id}`)
    }


    return { status: "OK", error: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors as FieldErrors;
      setErrors(fieldErrors);

      // loop each field & show toast (notification)
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        if (messages?.length) {
          toast.error(`${field[0].toUpperCase()}${field.slice(1)}: ${messages[0]}`);
        }
      });

      return { status: "ERROR", error: "Validation failed" };
    }

    toast.error("An unexpected error occurred ❌");
    return { status: "ERROR", error: "Unexpected error" };
  }
};

  // 21) Wire the action to the <form>. isPending is true during submit.
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    handleFormSubmit,
    { status: "INITIAL", error: "" }
  );

  return (
    <form action={formAction} className="px-20 lg:px-60 flex flex-col gap-3">

      {/* 22) Toast portal. Put it once per app (root) ideally; local is fine while prototyping */}
      <Toaster richColors closeButton expand position="bottom-left" />

      {/* Title */}
      <div>
        <label htmlFor="title">Title</label>
        <Input
          id="title"
          name="title"
          required
          placeholder="startup title"
          aria-invalid={Boolean(errors.title?.length)}
        />
        {/* Inline error (optional) */}
        {/* {errors.title?.[0] && <p className="text-sm text-red-600">{errors.title[0]}</p>} */}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="startup description"
        />
        {/* {errors.description?.[0] && (
          <p className="text-sm text-red-600">{errors.description[0]}</p>
        )} */}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category">Category</label>
        <Input
          id="category"
          name="category"
          required
          placeholder="startup category"
        />
        {/* {errors.category?.[0] && (
          <p className="text-sm text-red-600">{errors.category[0]}</p>
        )} */}
      </div>

      {/* Image */}
      <div>
        <label htmlFor="image">Image URL</label>
        <Input
          id="image"
          name="image"
          required
          placeholder="https://example.com/logo.png"
        />
        {/* {errors.image?.[0] && <p className="text-sm text-red-600">{errors.image[0]}</p>} */}
      </div>

      {/* Pitch (Markdown) */}
      <div data-color-mode="light">
        <label htmlFor="pitch">Pitch</label>
        <MDEditor
          id="pitch"
          value={pitch}
          onChange={(v) => setPitch((v ?? "").toString())}
          // preview="edit"
          textareaProps={{
            placeholder: "Briefly describe your idea and what it solves",
            autoCapitalize: "off",
          }}
        />
        {/* {errors.pitch?.[0] && <p className="text-sm text-red-600">{errors.pitch[0]}</p>} */}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending} aria-busy={isPending}>
        {isPending ? "Submitting..." : "Submit pitch"}
        <Send />
      </Button>

      {/* 23) Optional global error display */}
      {/* {state.status === "ERROR" && (
        <p className="text-sm text-red-700">Something went wrong: {state.error}</p>
      )} */}
    </form>
  );
}
