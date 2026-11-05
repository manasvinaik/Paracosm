import { useMemo } from "react";
import { useParams } from "react-router-dom";
import CategoryPage from "./CategoryPage";

export default function CustomCategoryPage() {
  const { categoryName } = useParams();
  const category = categoryName || "";
  const props = useMemo(() => ({
    title: category,
    eyebrow: "A SHELF OF YOUR OWN",
    description: `Your personal collection of ${category.toLowerCase()}.`,
    category,
    symbol: "✦",
    accent: "banner-lilac",
  }), [category]);
  return <CategoryPage {...props}/>;
}
