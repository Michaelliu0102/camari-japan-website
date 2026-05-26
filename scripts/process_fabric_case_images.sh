#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: bash scripts/process_fabric_case_images.sh <input-dir> <output-dir> [target-width]"
  echo "Example: bash scripts/process_fabric_case_images.sh ./public/uploads/fabric/Hover ./public/uploads/fabric/Case 1400"
  exit 1
fi

input_dir="${1%/}"
output_dir="${2%/}"
target_width="${3:-1400}"

if [[ ! -d "$input_dir" ]]; then
  echo "Input directory not found: $input_dir"
  exit 1
fi

mkdir -p "$output_dir"

processed_count=0

while IFS= read -r -d '' file_path; do
  relative_path="${file_path#$input_dir/}"
  relative_dir="$(dirname "$relative_path")"
  base_name="$(basename "$relative_path")"
  stem="${base_name%.*}"

  mkdir -p "$output_dir/$relative_dir"

  output_file="$output_dir/$relative_dir/$stem.jpg"
  sips -s format jpeg -s formatOptions 85 --resampleWidth "$target_width" "$file_path" --out "$output_file" >/dev/null

  processed_count=$((processed_count + 1))
  echo "Processed: $relative_path"
done < <(find "$input_dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -print0)

echo
echo "Done. Processed $processed_count image(s)."
echo "Case images: $output_dir"
