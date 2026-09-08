/**
 * Shape of public/data/game-content.json.
 *
 * Source-controlled runtime content, edited directly by a coder — nothing
 * generates this file. Kept deliberately minimal until the game concept is
 * agreed; expect ContentItem to gain real fields (and probably a union of
 * item kinds) once we know what the game is.
 */

/** One unit of runtime content. `id` is the only field the game relies on today. */
export interface ContentItem {
  id: string;
}

/** Top-level structure of the content file. */
export interface GameContent {
  items: ContentItem[];
}
