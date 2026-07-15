import type { ClientModule } from '@docusaurus/types';

const LEGACY_MEETING_DATE = /^#(\d{4})-(\d{2})-(\d{2})$/;

const legacyMeetingRedirect: ClientModule = {
  onRouteUpdate({ location }) {
    if (location.pathname === '/meetings') {
      const match = LEGACY_MEETING_DATE.exec(location.hash);

      if (match) {
        const [, year, month, day] = match;

        window.location.replace(`/meetings/${year}/${month}/${day}`);
      }
    }
  },
};

export default legacyMeetingRedirect;
