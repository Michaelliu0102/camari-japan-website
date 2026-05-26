#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: bash scripts/process_fabric_images.sh <input-dir> <output-dir> [cover-size]"
  echo "Example: bash scripts/process_fabric_images.sh ./incoming/fabric ./public/uploads/fabric-cover 1600"
  exit 1
fi

input_dir="${1%/}"
output_dir="${2%/}"
cover_size="${3:-1600}"

if [[ ! -d "$input_dir" ]]; then
  echo "Input directory not found: $input_dir"
  exit 1
fi

mkdir -p "$output_dir"

make_square() {
  local input_file="$1"
  local output_file="$2"
  local size="$3"
  local width
  local height
  local temp_file
  local temp_dir

  width="$(sips -g pixelWidth "$input_file" 2>/dev/null | awk '/pixelWidth:/ {print $2}')"
  height="$(sips -g pixelHeight "$input_file" 2>/dev/null | awk '/pixelHeight:/ {print $2}')"
  temp_dir="$(mktemp -d "/tmp/fabric-square.XXXXXX")"
  temp_file="$temp_dir/temp.jpg"

  if (( width <= height )); then
    sips -s format jpeg -s formatOptions 85 --resampleWidth "$size" "$input_file" --out "$temp_file" >/dev/null
  else
    sips -s format jpeg -s formatOptions 85 --resampleHeight "$size" "$input_file" --out "$temp_file" >/dev/null
  fi

  sips -s format jpeg -s formatOptions 85 -c "$size" "$size" "$temp_file" --out "$output_file" >/dev/null
  rm -f "$temp_file"
  rmdir "$temp_dir"
}

processed_count=0

while IFS= read -r -d '' file_path; do
  relative_path="${file_path#$input_dir/}"
  relative_dir="$(dirname "$relative_path")"
  base_name="$(basename "$relative_path")"
  stem="${base_name%.*}"

  mkdir -p "$output_dir/$relative_dir"

  cover_out="$output_dir/$relative_dir/$stem.jpg"

  make_square "$file_path" "$cover_out" "$cover_size"

  processed_count=$((processed_count + 1))
  echo "Processed: $relative_path"
done < <(find "$input_dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -print0)

echo
echo "Done. Processed $processed_count image(s)."
echo "Cover images: $output_dir"
