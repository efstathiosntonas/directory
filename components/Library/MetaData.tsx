import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, A, P, Caption, darkColors } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { Library as LibraryType } from '~/types';

import { DirectoryScore } from './DirectoryScore';
import { Star, Download, Eye, Issue, Web, License, Fork, Code, TypeScript } from '../Icons';

type Props = {
  library: LibraryType;
  secondary?: boolean;
};

function generateData({ github, score, npm, npmPkg }: LibraryType, isDark: boolean) {
  const iconColor = isDark ? darkColors.pewter : colors.gray5;
  return [
    {
      id: 'score',
      icon: <DirectoryScore score={score} />,
      content: (
        <A
          target="_self"
          href="/scoring"
          style={{ ...styles.link, ...styles.mutedLink }}
          hoverStyle={isDark && { color: colors.primaryDark }}>
          Directory Score
        </A>
      ),
    },
    npm.downloads
      ? {
          id: 'downloads',
          icon: <Download fill={iconColor} width={16} height={18} />,
          content: (
            <A href={`https://www.npmjs.com/package/${npmPkg}`} style={styles.link}>
              {`${npm.downloads.toLocaleString()}`} monthly downloads
            </A>
          ),
        }
      : null,
    {
      id: 'star',
      icon: <Star fill={iconColor} />,
      content: (
        <A href={`${github.urls.repo}/stargazers`} style={styles.link}>
          {github.stats.stars.toLocaleString()} stars
        </A>
      ),
    },
    github.stats.forks
      ? {
          id: 'forks',
          icon: <Fork fill={iconColor} width={16} height={17} />,
          content: (
            <A href={`${github.urls.repo}/network/members`} style={styles.link}>
              {`${github.stats.forks.toLocaleString()}`} forks
            </A>
          ),
        }
      : null,
    github.stats.subscribers
      ? {
          id: 'subscribers',
          icon: <Eye fill={iconColor} />,
          content: (
            <A href={`${github.urls.repo}/watchers`} style={styles.link}>
              {`${github.stats.subscribers.toLocaleString()}`} watchers
            </A>
          ),
        }
      : null,
    github.stats.issues
      ? {
          id: 'issues',
          icon: <Issue fill={iconColor} />,
          content: (
            <A href={`${github.urls.repo}/issues`} style={styles.link}>
              {`${github.stats.issues.toLocaleString()}`} issues
            </A>
          ),
        }
      : null,
  ];
}

function generateSecondaryData({ github, examples }: LibraryType, isDark: boolean) {
  const secondaryTextColor = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };
  const iconColor = isDark ? darkColors.pewter : colors.secondary;
  const paragraphStyles = [styles.secondaryText, secondaryTextColor];
  const linkStyles = [...paragraphStyles, styles.mutedLink];
  const hoverStyle = isDark && { color: colors.primaryDark };

  return [
    github.urls.homepage
      ? {
          id: 'web',
          icon: <Web fill={iconColor} width={16} height={16} />,
          content: (
            <A href={github.urls.homepage} style={linkStyles} hoverStyle={hoverStyle}>
              Website
            </A>
          ),
        }
      : null,
    github.license
      ? {
          id: 'license',
          icon: <License fill={iconColor} width={14} height={16} />,
          content:
            github.license.name === 'Other' ? (
              <P style={paragraphStyles}>Unrecognized License</P>
            ) : (
              <A href={github.license.url} style={linkStyles} hoverStyle={hoverStyle}>
                {github.license.name}
              </A>
            ),
        }
      : null,
    github.hasTypes
      ? {
          id: 'types',
          icon: <TypeScript fill={iconColor} width={16} height={16} />,
          content: <P style={paragraphStyles}>TypeScript Types</P>,
        }
      : null,
    examples && examples.length
      ? {
          id: 'examples',
          icon: <Code fill={iconColor} width={16} height={16} />,
          content: (
            <>
              <Caption style={paragraphStyles}>Examples: </Caption>
              {examples.map((example, index) => (
                <A
                  key={example}
                  href={example}
                  style={[...linkStyles, styles.exampleLink]}
                  hoverStyle={hoverStyle}>
                  #{index + 1}
                </A>
              ))}
            </>
          ),
        }
      : null,
  ];
}

export function MetaData({ library, secondary }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const data = secondary ? generateSecondaryData(library, isDark) : generateData(library, isDark);

  return (
    <>
      {data.filter(Boolean).map(({ id, icon, content }, i) => (
        <View
          key={id}
          style={[
            styles.displayHorizontal,
            i + 1 !== data.length ? styles.datumContainer : {},
            secondary ? styles.secondaryContainer : {},
          ]}>
          <View style={[styles.iconContainer, secondary ? styles.secondaryIconContainer : {}]}>
            {icon}
          </View>
          {content}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  datumContainer: {
    marginBottom: 8,
    minHeight: 22,
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
    width: 20,
    alignItems: 'center',
  },
  link: {
    fontSize: 15,
    fontWeight: 300,
  },
  mutedLink: {
    backgroundColor: 'transparent',
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: 300,
  },
  secondaryContainer: {
    marginBottom: 6,
    marginRight: 16,
  },
  secondaryIconContainer: {
    marginRight: 6,
  },
  exampleLink: {
    marginLeft: 2,
    marginRight: 4,
    fontSize: 13,
  },
});
