import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { UIBuild } from 'evergreen.js/lib/models';
import * as React from 'react';
import '../../styles.css';

interface StatusCount { [id: string]: number };

interface State {
  name: string,
  statusCount: StatusCount,
  sortedStatus: Array<{
    "status": string,
    "count": number
  }>,
}

class Props {
  public build: UIBuild;
}

export class Variant extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const statusCount = {};
    for (const task of this.props.build.Build.tasks) {
      if (statusCount[task.status]) {
        statusCount[task.status]++;
      } else {
        statusCount[task.status] = 1;
      }
    }
    this.state = {
      name: this.props.build.Build.display_name,
      statusCount: statusCount,
      sortedStatus: this.orderByPriority(statusCount),
    };
  }

  public render() {

    const VariantsByStatus = () => (
      <Grid container={true} spacing={8}>
        {this.state.sortedStatus.map(statusObj => (
          <Grid item={true} xs={4} key={statusObj.status}>
            <Card>
              <CardContent className={statusObj.status}>
                {statusObj.count}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );

    return (
      <Card className="variant-card">
        <VariantsByStatus />
        <Typography variant="body1" className="variant-title">
          {this.state.name}
        </Typography>
      </Card>
    );
  }

  private compareByPriority(a: string, b: string) {
    const displayPriority = {
      "failed": 0,
      "timed-out": 1,
      "system-failed": 2,
      "system-unresponsive": 3,
      "setup-failed": 4,
      "success": 5,
      "started": 6,
      "dispatched": 7,
      "undispatched": 8,
      "inactive": 9,
    }
    return displayPriority[a] > displayPriority[b] ? 1 : -1;
  }

  private orderByPriority(statusCount: StatusCount) {
    const sortedStatus = [];
    const asArray = [];
    for (const key of Object.keys(statusCount)) {
      asArray.push(key);
    }
    asArray.sort(this.compareByPriority);
    for (const sortedKey of asArray) {
      const statusObj = {
        "status": sortedKey,
        "count": statusCount[sortedKey]
      };
      sortedStatus.push(statusObj);
    }
    return sortedStatus;
  }
}

export default Variant;