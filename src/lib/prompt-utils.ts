import { PromptState } from '@/types/wizard';

export function assemblePrompt(state: PromptState): string {
    const sections: string[] = [];

    // Scene Section
    const { scene } = state;
    const sceneParts = [
        scene.location && `in a ${scene.location.toLowerCase()}`,
        scene.timeOfDay && `at ${scene.timeOfDay.toLowerCase()}`,
        scene.weather && `under ${scene.weather.toLowerCase()}`,
        scene.envDescription,
        scene.sensoryDetails,
    ].filter(Boolean);
    if (sceneParts.length > 0) {
        sections.push(`- Scene: ${capitalize(sceneParts.join(' ')).trim()}.`);
    }

    // Characters Section
    const { characters } = state;
    const charParts = [
        characters.count > 0 && `${characters.count} ${characters.role || 'person/people'}`,
        characters.ageGroup && `(${characters.ageGroup.toLowerCase()})`,
        characters.attire && `wearing ${characters.attire.toLowerCase()}`,
        characters.gestures && `with ${characters.gestures.toLowerCase()}`,
        characters.emotions && `feeling ${characters.emotions.toLowerCase()}`,
        characters.props && `holding ${characters.props.toLowerCase()}`,
        characters.culturalNotes,
    ].filter(Boolean);
    if (charParts.length > 0) {
        sections.push(`- Characters: ${capitalize(charParts.join(' ')).trim()}.`);
    }

    // Camera Section
    const { camera } = state;
    const cameraParts = [
        camera.shotType && `a ${camera.shotType.toLowerCase()}`,
        camera.angle && `from ${camera.angle.toLowerCase()}`,
        camera.movement && `with ${camera.movement.toLowerCase()} movement`,
        camera.lensStyle && `using a ${camera.lensStyle.toLowerCase()} lens`,
        camera.aspectRatio && `at ${camera.aspectRatio}`,
        camera.notes,
    ].filter(Boolean);
    if (cameraParts.length > 0) {
        sections.push(`- Camera: ${capitalize(cameraParts.join(' ')).trim()}.`);
    }

    // Emotion Section
    const { emotion } = state;
    const emotionParts = [
        emotion.mood && `${emotion.mood} mood`,
        emotion.pacing && `with ${emotion.pacing.toLowerCase()} pacing`,
        emotion.colorGrade && `in a ${emotion.colorGrade.toLowerCase()} color grade`,
        emotion.nuance,
    ].filter(Boolean);
    if (emotionParts.length > 0) {
        sections.push(`- Emotion: ${capitalize(emotionParts.join(' ')).trim()}.`);
    }

    // Dialogue Section
    const { dialogue } = state;
    const dialogueParts = [
        dialogue.language && `in ${dialogue.language}`,
        dialogue.style && `as ${dialogue.style.toLowerCase()}`,
        dialogue.delivery && `delivered ${dialogue.delivery.toLowerCase()}`,
        dialogue.lines && `saying "${dialogue.lines}"`,
        dialogue.ambience && `with ambient ${dialogue.ambience.toLowerCase()}`,
    ].filter(Boolean);
    if (dialogueParts.length > 0) {
        sections.push(`- Dialogue/Sound: ${capitalize(dialogueParts.join(' ')).trim()}.`);
    }

    // Technical Section
    const { technical } = state;
    const techParts = [
        technical.resolution && `${technical.resolution} resolution`,
        technical.motionFidelity && `with ${technical.motionFidelity.toLowerCase()} motion fidelity`,
        technical.realismLevel && `at ${technical.realismLevel.toLowerCase()} level`,
        technical.safetyRating && `rated ${technical.safetyRating.toLowerCase()}`,
        technical.constraints,
    ].filter(Boolean);
    if (techParts.length > 0) {
        sections.push(`- Technical: ${capitalize(techParts.join(' ')).trim()}.`);
    }

    return sections.join('\n');
}


export function validateStep(stepId: string, state: PromptState): { valid: boolean; error?: string } {
    switch (stepId) {
        case 'scene': {
            const { scene } = state;
            const hasValue = Object.values(scene).some(v => v && v.toString().trim().length > 0);
            return {
                valid: hasValue,
                error: hasValue ? undefined : 'Please fill at least one field in the Scene Setup.'
            };
        }
        case 'characters': {
            const { characters } = state;
            if (characters.count > 0) {
                const hasEssentials = !!((characters.role && characters.role.length > 0) ||
                    (characters.attire && characters.attire.length > 0));
                return {
                    valid: hasEssentials,
                    error: hasEssentials ? undefined : 'If count > 0, please specify a role or attire for the characters.'
                };
            }
            return { valid: true };
        }
        case 'camera': {
            const { camera } = state;
            const hasEssentials = !!((camera.shotType && camera.shotType.length > 0) ||
                (camera.movement && camera.movement.length > 0));
            return {
                valid: hasEssentials,
                error: hasEssentials ? undefined : 'Please select at least a shot type or movement.'
            };
        }
        default:
            return { valid: true };
    }
}

export function isStateEmpty(state: PromptState): boolean {
    return Object.values(state).every(section =>
        Object.values(section).every(v => !v || (typeof v === 'string' && v.trim().length === 0) || (typeof v === 'number' && v === 0))
    );
}

function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
