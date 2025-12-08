"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import { Todo } from "../types";

interface TodoModalProps {
  todo: Todo | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TodoSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
});

export default function TodoModal({
  todo,
  onClose,
  onSuccess,
}: TodoModalProps) {
  const handleSubmit = async (
    values: { title: string; description: string },
    { setSubmitting }: FormikHelpers<{ title: string; description: string }>
  ) => {
    try {
      const url = todo
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todo/${todo._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todo`;
      const method = todo ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (method === "POST" && res.ok) {
        const data = await res.json();
        console.log("Created todo:", data);
      }

      if (method === "PUT" && res.ok) {
        const data = await res.json();
        console.log("Updated todo:", data);
      }

      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Save todo error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {todo ? "Edit Todo" : "Add New Todo"}
        </h2>

        <Formik
          initialValues={{
            title: todo?.title || "",
            description: todo?.description || "",
          }}
          validationSchema={TodoSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Field
                  name="title"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter todo title"
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                  placeholder="Enter todo description"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 cursor-pointer px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 cursor-pointer py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {isSubmitting ? "Saving..." : todo ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
